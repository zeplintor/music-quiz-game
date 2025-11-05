import yt_dlp
import os
from typing import Optional
import uuid


class YouTubeService:
    def __init__(self, output_dir: str = "./audio_cache"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    async def extract_audio(
        self,
        youtube_url: str,
        start_time: Optional[int] = None,
        end_time: Optional[int] = None
    ) -> str:
        """
        Extrait l'audio d'une vidéo YouTube

        Args:
            youtube_url: URL de la vidéo YouTube
            start_time: Temps de début en secondes (optionnel)
            end_time: Temps de fin en secondes (optionnel)

        Returns:
            Chemin vers le fichier audio extrait
        """
        file_id = str(uuid.uuid4())
        output_file = os.path.join(self.output_dir, f"{file_id}.mp3")

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': output_file.replace('.mp3', ''),
            'quiet': True,
            'no_warnings': True,
        }

        # Si on a des timings spécifiques
        if start_time is not None and end_time is not None:
            ydl_opts['postprocessor_args'] = [
                '-ss', str(start_time),
                '-to', str(end_time)
            ]
        elif start_time is None and end_time is None:
            # Prendre un extrait aléatoire de 10 secondes
            # On va juste prendre les premières 10 secondes pour simplifier
            ydl_opts['postprocessor_args'] = [
                '-ss', '30',  # Commence à 30 secondes
                '-t', '10'    # Dure 10 secondes
            ]

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])

            return f"/audio/{file_id}.mp3"

        except Exception as e:
            raise Exception(f"Erreur lors de l'extraction audio: {str(e)}")

    def get_video_info(self, youtube_url: str) -> dict:
        """Récupère les informations d'une vidéo YouTube"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                return {
                    'title': info.get('title'),
                    'duration': info.get('duration'),
                    'thumbnail': info.get('thumbnail'),
                }
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des infos: {str(e)}")
