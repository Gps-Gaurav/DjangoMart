bind = "0.0.0.0:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "info"

# SSL (if using HTTPS)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Process naming
proc_name = "djangomart"