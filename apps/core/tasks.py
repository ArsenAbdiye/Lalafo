from celery import shared_task

@shared_task
def test_task(name):
    print(f"Привет, {name} — задача работает!")
    return f"Привет, {name}"
