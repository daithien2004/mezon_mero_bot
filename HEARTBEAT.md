# 🫀 Heartbeat & Connection Monitoring

## Overview

The bot includes built-in **heartbeat** and **connection monitoring** services to ensure it stays alive and maintains a stable connection to Mezon servers, even when no users are actively interacting with it.

## Problem Solved

**Issue:** Mezon bots can timeout or lose connection when idle (no socket activity)

**Solution:** Automatic heartbeat system that:
- ✅ Sends periodic "alive" signals
- ✅ Monitors connection health
- ✅ Tracks uptime and memory usage
- ✅ Provides health check endpoints

---

## Services

### 1. HeartbeatService

**Purpose:** Keeps the bot process alive with periodic tasks

**Features:**
- Sends heartbeat every 30 seconds
- Tracks uptime since bot start
- Monitors memory usage
- Logs detailed stats every 5 minutes

**Configuration:**
```typescript
HEARTBEAT_INTERVAL = 30000 // 30 seconds
```

### 2. ConnectionMonitorService

**Purpose:** Monitors the Mezon WebSocket connection

**Features:**
- Checks connection health every 1 minute
- Tracks connection failures
- Works with Nezon's auto-retry mechanism
- Provides connection statistics

**Configuration:**
```typescript
CHECK_INTERVAL = 60000 // 1 minute
```

---

## Health Check Endpoints

### GET /health

Returns comprehensive bot health information:

```json
{
  "statusCode": 200,
  "status": "OK",
  "timestamp": "2026-02-03T09:30:00.000Z",
  "uptime": "2h 15m",
  "heartbeat": {
    "count": 270,
    "startTime": "2026-02-03T07:15:00.000Z"
  },
  "connection": {
    "healthy": true,
    "lastCheck": "2026-02-03T09:29:00.000Z",
    "failureCount": 0
  },
  "memory": {
    "heapUsed": "45MB",
    "heapTotal": "64MB"
  }
}
```

### GET /ping

Simple ping endpoint:

```json
{
  "statusCode": 200,
  "message": "pong",
  "timestamp": "2026-02-03T09:30:00.000Z"
}
```

---

## Monitoring

### Console Logs

**Every 30 seconds (debug):**
```
💓 Heartbeat #45 | Uptime: 22m 30s
```

**Every 5 minutes (info):**
```
💓 Heartbeat #10 | Uptime: 5m 0s | Memory: 42MB
```

**Connection checks:**
```
🔍 Connection check passed
✅ Connection restored
❌ Connection check failed (attempt 1)
```

### Health Indicators

| Indicator | Meaning |
|-----------|---------|
| 💓 | Heartbeat sent |
| 🫀 | Heartbeat service status |
| 🔌 | Connection monitor status |
| 🔍 | Connection check |
| ✅ | Healthy/Success |
| ❌ | Error/Failure |
| ⚠️ | Warning |
| 🔄 | Restart/Retry |

---

## Auto-Retry Configuration

The bot is configured with aggressive auto-retry in `app.module.ts`:

```typescript
NezonModule.forRoot({
  token: process.env.MEZON_TOKEN,
  botId: process.env.MEZON_BOT_ID,
  autoRetry: true,           // Enable automatic reconnection
  maxRetry: undefined,        // Unlimited retry attempts
  retryDuration: undefined,   // No time limit for retries
})
```

This ensures the bot will:
- ✅ Automatically reconnect on connection loss
- ✅ Retry indefinitely until connection is restored
- ✅ Never give up trying to reconnect

---

## Deployment Recommendations

### For Production

1. **Use a Process Manager** (PM2, systemd, etc.)
   ```bash
   npm install -g pm2
   pm2 start npm --name "mezon-bot" -- run start:prod
   pm2 save
   pm2 startup
   ```

2. **Monitor Health Endpoint**
   - Set up external monitoring (UptimeRobot, Pingdom, etc.)
   - Check `/health` every 5 minutes
   - Alert if status is not 200 or `healthy: false`

3. **Log Management**
   ```bash
   # View logs
   pm2 logs mezon-bot
   
   # Clear old logs
   pm2 flush
   ```

### For Development

```bash
npm run start:dev
# Heartbeat will run automatically
# Check http://localhost:3000/health
```

---

## Troubleshooting

### Bot Still Timing Out?

1. **Check environment variables:**
   ```bash
   # Ensure .env has valid credentials
   MEZON_TOKEN=your_token_here
   MEZON_BOT_ID=your_bot_id_here
   ```

2. **Check logs for errors:**
   ```bash
   # Look for connection errors
   grep "Connection" logs/*.log
   ```

3. **Verify health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

4. **Check connection stats:**
   - If `failureCount > 3`, there may be network issues
   - If `healthy: false`, investigate connection problems

### High Memory Usage?

The heartbeat service monitors memory. If heap usage is high:

1. **Check for memory leaks:**
   ```bash
   # Monitor memory over time
   watch -n 5 'curl -s http://localhost:3000/health | jq .memory'
   ```

2. **Restart if needed:**
   ```bash
   pm2 restart mezon-bot
   ```

---

## Technical Details

### Heartbeat Algorithm

```typescript
// Every 30 seconds:
1. Increment heartbeat counter
2. Calculate uptime
3. Check memory usage
4. Log status (debug level)
5. Every 10 heartbeats → log detailed info
```

### Connection Monitoring

```typescript
// Every 60 seconds:
1. Check connection status
2. Track failures
3. Log results
4. If 3+ failures → log warning
5. Rely on Nezon auto-retry for reconnection
```

---

## Benefits

✅ **Prevents Timeout** - Bot stays alive even when idle  
✅ **Auto-Recovery** - Automatically reconnects on connection loss  
✅ **Monitoring** - Easy to check bot health via HTTP endpoints  
✅ **Debugging** - Detailed logs help diagnose issues  
✅ **Production-Ready** - Works with process managers and monitoring tools  

---

## Next Steps

- [ ] Set up external monitoring for `/health` endpoint
- [ ] Configure alerts for connection failures
- [ ] Use PM2 or similar for automatic restarts
- [ ] Monitor memory usage trends
- [ ] Set up log rotation

---

**Your bot will now stay alive 24/7! 🎉**
