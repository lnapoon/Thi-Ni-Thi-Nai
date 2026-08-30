import traceback
import sys
from django.http import HttpResponse

class DebugExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        tb = traceback.format_exc()
        print("=== UNCAUGHT SERVERLESS EXCEPTION ===", file=sys.stderr)
        print(tb, file=sys.stderr)
        if request.GET.get('debug') == '1':
            return HttpResponse(f"<pre style='color:red; font-size:14px; padding:20px;'>{tb}</pre>", status=500)
        return None
