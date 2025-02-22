from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import FileSystemStorage
from base.sockets.tasks import process_csv_task


class UploadFileAPIView(APIView):
    def post(self, request, *args, **kwargs):
        if "csv_file" not in request.FILES:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )
        csv_file = request.FILES["csv_file"]
        fs = FileSystemStorage()
        filename = fs.save(csv_file.name, csv_file)
        file_path = fs.path(filename)
        process_csv_task.delay(file_path, request.user.id)
        return Response(
            {"message": "File uploaded successfully, processing started"},
            status=status.HTTP_202_ACCEPTED,
        )
