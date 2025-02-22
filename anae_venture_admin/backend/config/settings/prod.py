from .base import *

DEBUG = False
ALLOWED_HOSTS = [""]

# SECURITY
# ------------------------------------------------------------------------------
# https://docs.djangoprojects.com/en/dev/ref/settings/#secure-proxy-ssl-header
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# https://docs.djangoprojects.com/en/dev/ref/settings/#secure-ssl-redirect
SECURE_SSL_REDIRECT = True
# https://docs.djangoprojects.com/en/dev/ref/settings/#session-cookie-secure
SESSION_COOKIE_SECURE = True
# https://docs.djangoprojects.com/en/dev/ref/settings/#csrf-cookie-secure
CSRF_COOKIE_SECURE = True
# https://docs.djangoprojects.com/en/dev/topics/security/#ssl-https
# https://docs.djangoprojects.com/en/dev/ref/settings/#secure-hsts-seconds
SECURE_HSTS_SECONDS = 2592000
# https://docs.djangoprojects.com/en/dev/ref/settings/#secure-hsts-include-subdomains
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# https://docs.djangoprojects.com/en/dev/ref/settings/#secure-hsts-preload
SECURE_HSTS_PRELOAD = True
# https://docs.djangoprojects.com/en/dev/ref/middleware/#x-content-type-options-nosniff
SECURE_CONTENT_TYPE_NOSNIFF = True
