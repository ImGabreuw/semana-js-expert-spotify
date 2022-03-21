# SOX Commands

> ## **Comandos básicos**

```shell
$ sox \
  --i \
  "audio/songs/conversation.mp3"
```

```shell
$ sox \
  --i \
  "audio/fx/Boo! Sound Effect (128 kbps).mp3"
```

> ## **Converter para o mesmo _bitrate_**

```shell
$ sox \
  -v 0.99 \
  -t mp3 \
  "audio/fx/Applause Sound Effect HD No Copyright (128 kbps).mp3" \
  -r 48000 \
  -t mp3 \
  "output.mp3"
```

> ## **Obter o _bitrate_**

```shell
$ sox \
  --i \
  -B \
  "audio/fx/Boo! Sound Effect (128 kbps).mp3"
```

> ## **Concatenar dois audios**

```shell
$ sox \
  -t mp3 \
  -v 0.99 \
  -m "audio/songs/conversation.mp3" \
  -t mp3 \
  -v 0.99 \
  "audio/fx/Fart - Gaming Sound Effect (HD) (128 kbps).mp3" \
  -t mp3 \
  "output.mp3"
```
