const asyncRun = require('../src/db/asyncRun.js');
const initDB = require('../src/db/initDB.js')

const jobQueueInserts = [
    "INSERT INTO job_queue (title, command) VALUES ('Daily Email Blast', 'node scripts/send_emails.js')",
    "INSERT INTO job_queue (title, command, max_retries) VALUES ('Critical Data Sync', 'python3 sync_data.py --critical', 10)",
    "INSERT INTO job_queue (title, command, state, attempts, max_retries) VALUES ('Resize Image', 'mogrify -resize 50% image.jpg', 'pending', 1, 3)",
    "INSERT INTO job_queue (title, command, state, attempts, updated_at) VALUES ('Generate PDF Report', 'node report_gen.js --id=123', 'processing', 1, DATETIME('now'))",
    "INSERT INTO job_queue (title, command, state, attempts, max_retries) VALUES ('Webhook Notification', 'curl -X POST https://api.example.com/hook', 'pending', 4, 5)",
    "INSERT INTO job_queue (title, command, max_retries) VALUES ('One-time Cleanup', 'rm -rf /tmp/cache_v1', 0)",
    "INSERT INTO job_queue (title, command, state, attempts, created_at, updated_at) VALUES ('Long Video Transcode', 'ffmpeg -i input.mp4 output.mkv', 'processing', 1, DATETIME('now', '-2 hours'), DATETIME('now', '-2 hours'))",
    "INSERT INTO job_queue (title, command, created_at) VALUES ('Midnight Backup', 'tar -czf backup.tar.gz /data', DATETIME('now', '-1 day'))",
    "INSERT INTO job_queue (title, command, state) VALUES ('Complex Analytics', 'node analytics.js --start=\"2023-01-01\" --end=\"2023-12-31\" --verbose', 'pending')",
    "INSERT INTO job_queue (title, command, state, attempts) VALUES ('Held Transaction', 'process_payment.sh --txid=999', 'held', 0)"
];

const dlqInserts = [
    "INSERT INTO dead_letter_queue (title, command, max_retries, created_at, updated_at) VALUES ('Failed Payment', 'node process_payment.js --id=555', 3, DATETIME('now', '-2 days'), DATETIME('now', '-2 days', '+1 hour'))",
    "INSERT INTO dead_letter_queue (title, command, max_retries, created_at, updated_at) VALUES ('Invalid Webhook', 'curl -X POST https://broken-api.com/callback', 5, DATETIME('now', '-1 week'), DATETIME('now', '-6 days'))",
    "INSERT INTO dead_letter_queue (title, command, max_retries) VALUES ('Syntax Error Script', 'python3 script_with_typo.py', 3)",
    "INSERT INTO dead_letter_queue (title, command, max_retries) VALUES ('Timeout Job', 'sleep 3600', 1)",
    "INSERT INTO dead_letter_queue (title, command, max_retries, created_at) VALUES ('Missing Dependency', 'node requires_missing_lib.js', 3, DATETIME('now', '-3 days'))",
    "INSERT INTO dead_letter_queue (title, command, max_retries) VALUES ('Database Connection Fail', 'java -jar db-migrator.jar', 10)",
    "INSERT INTO dead_letter_queue (title, command, max_retries) VALUES ('Out of Memory', 'process_huge_dataset.sh', 0)",
    "INSERT INTO dead_letter_queue (title, command, max_retries, created_at, updated_at) VALUES ('API Rate Limit Exceeded', 'node fetch_data.js --all', 5, DATETIME('now', '-12 hours'), DATETIME('now', '-11 hours'))",
    "INSERT INTO dead_letter_queue (title, command, max_retries) VALUES ('Permission Denied', 'touch /root/test_file', 3)",
    "INSERT INTO dead_letter_queue (title, command, max_retries) VALUES ('Corrupt Input File', 'ffmpeg -i corrupt.mp4 out.avi', 3)"
];

const archiveInserts = [
    "INSERT INTO archive (title, command, attempts, max_retries, created_at, updated_at) VALUES ('User Signup Email', 'node mailer.js --user=newbie', 1, 3, DATETIME('now', '-1 day'), DATETIME('now', '-1 day', '+5 seconds'))",
    "INSERT INTO archive (title, command, attempts, max_retries, created_at, updated_at) VALUES ('Sync External API', 'node sync.js --full', 3, 5, DATETIME('now', '-5 hours'), DATETIME('now', '-4 hours'))",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Upload Heavy File', 'aws s3 cp large.dat s3://bucket/', 5, 5)",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Cache Clear', 'redis-cli FLUSHALL', 1, 0)",
    "INSERT INTO archive (title, command, attempts, created_at, updated_at) VALUES ('Monthly Invoice Gen', 'php artisan invoice:generate', 1, DATETIME('now', '-1 month'), DATETIME('now', '-1 month', '+2 minutes'))",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Manually Cancelled Job', 'sleep 1000', 1, 10)",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Ping Health Check', 'ping -c 1 google.com', 1, 3)",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Data Migration v2', 'migrate --source=prod --dest=warehouse --tables=all', 2, 5)",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Non-Critical Log Rotate', 'logrotate -f /etc/logrotate.conf', 3, 3)",
    "INSERT INTO archive (title, command, attempts, max_retries) VALUES ('Update User Stats', 'node jobs/update_stats.js', 1, 3)"
];

async function mock() {
    await initDB();
    for (let index = 0; index < 10; index++) {
        await asyncRun(jobQueueInserts[index]);
        await asyncRun(dlqInserts[index]);
        await asyncRun(archiveInserts[index]);
    }
}

module.exports = mock;