import logging
import sys
import traceback
from pathlib import Path
from urllib.parse import quote
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from django.conf import settings

logger = logging.getLogger(__name__)


def service_worker_view(request: HttpRequest) -> HttpResponse:
    sw_path = Path(settings.BASE_DIR) / "static" / "sw.js"
    if sw_path.exists():
        return HttpResponse(sw_path.read_bytes(), content_type="application/javascript")
    return HttpResponse("// sw not found", content_type="application/javascript")


def media_redirect_view(request: HttpRequest, path: str = "") -> HttpResponse:
    clean_path = path.lstrip("/")
    if not clean_path.startswith("media/"):
        clean_path = f"media/{clean_path}"
    cloud_name = getattr(settings, "CLOUDINARY_CLOUD_NAME", None) or "pkxxxmpn"
    safe_path = quote(clean_path, safe="/._-")
    return redirect(
        f"https://res.cloudinary.com/{cloud_name}/image/upload/v1/{safe_path}",
        permanent=False,
    )


def custom_500_view(request: HttpRequest) -> HttpResponse:
    exc_info = sys.exc_info()
    tb_str = traceback.format_exc()
    if tb_str.strip() == "NoneType: None":
        tb_str = ""

    # Always log full traceback on server side
    if exc_info[1]:
        logger.error(
            "Internal Server Error 500: %s (Path: %s)",
            exc_info[1],
            request.path,
            exc_info=exc_info,
        )
    else:
        logger.error("Internal Server Error 500 on %s", request.path)

    # Security: only expose traceback and technical error details to staff or in DEBUG mode
    is_staff_or_debug = settings.DEBUG or (
        hasattr(request, "user")
        and request.user.is_authenticated
        and request.user.is_staff
    )

    if is_staff_or_debug:
        error_msg = str(exc_info[1]) if exc_info[1] else "ไม่ทราบสาเหตุ"
        display_tb = tb_str
    else:
        error_msg = ""
        display_tb = ""

    return render(
        request,
        "500.html",
        {
            "error_traceback": display_tb,
            "error_message": error_msg,
            "is_debug_view": is_staff_or_debug,
        },
        status=500,
    )


def custom_403_view(request: HttpRequest, exception: object = None) -> HttpResponse:
    return render(request, "403.html", {"exception": exception}, status=403)


def custom_404_view(request: HttpRequest, exception: object = None) -> HttpResponse:
    return render(request, "404.html", {"exception": exception}, status=404)

