import sys
import traceback
from pathlib import Path
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from django.conf import settings


def service_worker_view(request: HttpRequest) -> HttpResponse:
    sw_path = Path(settings.BASE_DIR) / "static" / "sw.js"
    if sw_path.exists():
        return HttpResponse(sw_path.read_bytes(), content_type="application/javascript")
    return HttpResponse("// sw not found", content_type="application/javascript")


def media_redirect_view(request: HttpRequest, path: str = "") -> HttpResponse:
    clean_path = path.lstrip("/")
    if not clean_path.startswith("media/"):
        clean_path = f"media/{clean_path}"
    return redirect(
        f"https://res.cloudinary.com/pkxxxmpn/image/upload/v1/{clean_path}",
        permanent=False,
    )


def custom_500_view(request: HttpRequest) -> HttpResponse:
    tb_str = traceback.format_exc()
    if tb_str.strip() == "NoneType: None":
        tb_str = ""

    exc_info = sys.exc_info()
    error_msg = str(exc_info[1]) if exc_info[1] else "ไม่ทราบสาเหตุ"

    return render(
        request,
        "500.html",
        {
            "error_traceback": tb_str,
            "error_message": error_msg,
        },
        status=500,
    )


def custom_403_view(request: HttpRequest, exception: object = None) -> HttpResponse:
    return render(request, "403.html", {"exception": exception}, status=403)


def custom_404_view(request: HttpRequest, exception: object = None) -> HttpResponse:
    return render(request, "404.html", {"exception": exception}, status=404)
