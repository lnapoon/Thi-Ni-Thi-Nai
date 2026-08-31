import sys
import traceback
from pathlib import Path
from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse, HttpRequest
from django.conf import settings


def service_worker_view(request: HttpRequest) -> HttpResponse:
    sw_path = Path(settings.BASE_DIR) / "static" / "sw.js"
    if sw_path.exists():
        return FileResponse(open(sw_path, "rb"), content_type="application/javascript")
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
    exc_type, exc_value, exc_traceback = sys.exc_info()
    tb_str = ""
    if exc_type and exc_traceback:
        tb_str = "".join(
            traceback.format_exception(exc_type, exc_value, exc_traceback)
        )

    return render(
        request,
        "500.html",
        {
            "error_traceback": tb_str,
            "error_message": str(exc_value) if exc_value else "ไม่ทราบสาเหตุ",
        },
        status=500,
    )


def custom_403_view(
    request: HttpRequest, exception: Exception | None = None
) -> HttpResponse:
    return render(request, "403.html", {"exception": exception}, status=403)


def custom_404_view(
    request: HttpRequest, exception: Exception | None = None
) -> HttpResponse:
    return render(request, "404.html", {"exception": exception}, status=404)
