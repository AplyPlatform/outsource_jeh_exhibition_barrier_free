import qrcode

# QR 코드에 담을 데이터
url = "http://eh.aplx.link?i="

#for i in range(26):
i = 28
while i < 31:
    # QR 코드 생성
    qr = qrcode.QRCode(
        version=1,  # QR 코드의 버전 (1~40)
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # 오류 수정 수준
        box_size=40,  # QR 코드의 각 박스 크기
        border=1,  # 테두리 크기
    )

    data = url + str(i)
    qr.add_data(data)
    qr.make(fit=True)

    # QR 코드 이미지 생성
    img = qr.make_image(fill_color="black", back_color="white")

    # 이미지 파일로 저장
    img.save(str(i) + ".png")
    i = i + 1