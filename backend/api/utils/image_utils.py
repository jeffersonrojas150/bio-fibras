from PIL import Image
import io
from django.core.files.base import ContentFile


MAX_SIZE = (1200, 1200)
QUALITY = 75


def comprimir_imagen(imagen_field, formato='WEBP'):
    """
    Recibe un ImageField de Django, lo comprime y devuelve
    un ContentFile listo para guardar en el mismo campo.
    """
    if not imagen_field:
        return None

    img = Image.open(imagen_field)

    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')

    img.thumbnail(MAX_SIZE, Image.LANCZOS)

    output = io.BytesIO()
    img.save(output, format=formato, quality=QUALITY, optimize=True)
    output.seek(0)

    nombre_original = imagen_field.name or 'imagen'
    nombre_base = nombre_original.rsplit('.', 1)[0]
    nuevo_nombre = f"{nombre_base}.webp"

    return ContentFile(output.read(), name=nuevo_nombre)