def directory_path(instance, file_name):
    file = instance.__class__.__name__.lower()
    return f"{file}/{file_name}"