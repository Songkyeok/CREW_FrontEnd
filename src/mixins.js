export default {
    methods: {
        $elapsedTime(dateTime) {
            const date = new Date(dateTime);
            const currentTime = Date.now();

            const diff = (currentTime - date) / 1000;

            const times = [
                { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
                { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
                { name: '일', milliSeconds: 60 * 60 * 24 },
                { name: '시간', milliSeconds: 60 * 60 },
                { name: '분', milliSeconds: 60 },
            ];

            for (const value of times) {
                const betweenTime = Math.floor(diff / value.milliSeconds);

                if (betweenTime > 0) {
                    return `${betweenTime}${value.name} 전`;
                }
            }
            return '방금 전';
        },
        $formatDateTime(dateTime) {
            if (!dateTime) {
                return null;
            }
            const date = new Date(dateTime);
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            const formattedDateTime = date.toLocaleDateString("ko-KR", options);
            return formattedDateTime;
        },

        $formatTime(dateTime) {
            const date = new Date(dateTime);
            const options = {
                hour: "numeric",
                minute: "numeric",
            };
            const formattedDateTime = date.toLocaleString("ko-KR", options);
            return formattedDateTime;
        },   

        $formatDateTimePlus(dateTime) {
            const date = new Date(dateTime);
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            };
            const formattedDateTime = date.toLocaleString("ko-KR", options);
            return formattedDateTime;
        },        

        $loginCheck(user) {
            // true 로그인 O | false 로그인 X
            return !(user == '' || user == undefined);
        },
        $alert(text) {
            this.$swal.fire({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                    ${text}
                </p>`,
                confirmButtonColor: '#86a8e7',
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
            })
        },
    },
}