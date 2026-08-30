import sys
import traceback
from django.shortcuts import render

def custom_500_view(request):
    exc_type, exc_value, exc_traceback = sys.exc_info()
    tb_str = ""
    if exc_type:
        tb_str = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
    
    return render(request, '500.html', {
        'error_traceback': tb_str,
        'error_message': str(exc_value) if exc_value else 'ไม่ทราบสาเหตุ'
    }, status=500)

def custom_403_view(request, exception=None):
    return render(request, '403.html', {'exception': exception}, status=403)

def custom_404_view(request, exception=None):
    return render(request, '404.html', {'exception': exception}, status=404)
