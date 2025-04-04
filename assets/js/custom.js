$(document).ready(function () {
    // 게시글 내의 모든 이미지를 찾아서 처리
    $('.page__content img').each(function () {
        // 이미 링크로 감싸져있지 않은 이미지만 처리
        if ($(this).parent().prop('tagName') !== 'A') {
            $(this)
                .wrap('<a href="' + $(this).attr('src') + '" class="image-popup"></a>')
                // 이미지에 호버 효과 클래스 추가
                .addClass('hover-effect');
        }
    });

    // 이미지 팝업 설정
    $('.image-popup').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        fixedContentPos: true,
        mainClass: 'mfp-with-zoom', // 줌 효과 클래스
        image: {
            verticalFit: true,
            cursor: 'mfp-zoom-out-cur',
            // 모바일 대응을 위한 옵션 추가
            tError: '<a href="%url%">이미지</a> 로드 실패.',
        },
        zoom: {
            enabled: true,
            duration: 400, // 애니메이션 시간 증가
            easing: 'ease-in-out', // 부드러운 애니메이션
            opener: function (element) {
                return element.find('img');
            },
        },
        // 애니메이션 효과 추가
        removalDelay: 300,
        mainClass: 'mfp-fade',
    });
});
