import traceback
import sys
from django.http import HttpResponse
from django.conf import settings
from config.views import custom_500_view

class DebugExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception:
            tb = traceback.format_exc()
            print("=== UNCAUGHT SERVERLESS EXCEPTION ===", file=sys.stderr)
            print(tb, file=sys.stderr)
            
            if getattr(settings, "DEBUG", False):
                return HttpResponse(
                    f"<html><body style='font-family:sans-serif; background:#111; color:#ff6b6b; padding:20px;'>"
                    f"<h2>Server Error Traceback:</h2><pre style='background:#222; color:#eee; padding:15px; border-radius:8px;'>{tb}</pre>"
                    f"</body></html>",
                    status=500
                )
            return custom_500_view(request)
