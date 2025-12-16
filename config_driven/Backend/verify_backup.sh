#!/bin/bash
BASE_URL="http://localhost:8000/api/v1"
BACKUP_FILE="backup_diseases.json"

# 1. Login as Admin
echo "Logging in as Admin..."
curl -s -c /tmp/cookies_admin_backup.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@multipredict.com", "password": "password123"}' > /dev/null

# 2. Fetch All Configs (Full Docs)
echo "Fetching full configs..."
CONFIGS=$(curl -s -b /tmp/cookies_admin_backup.txt $BASE_URL/admin/configs)

# 3. Save to file
# We want just the array of data, but taking the full response is fine for restore parsing later.
echo "$CONFIGS" > $BACKUP_FILE

echo "Backup saved to $BACKUP_FILE"
cat $BACKUP_FILE
