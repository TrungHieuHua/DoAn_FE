export const setCookie = (name, value) => {
    const json = JSON.stringify(value);

    const encodedValue = encodeURIComponent(json); // mã hóa giá trị cookie

    const cookie = `${name}=${encodedValue};expires=Thu, 18 Dec 2028 12:00:00 UTC;path=/`;
    document.cookie = cookie;
};

export const getCookie = (name) => {
    const cookie = document.cookie.split(';').find((c) => c.trim().startsWith(`${name}=`));
    if (cookie) {
        const encodedCookie = cookie.split('=')[1];
        const decodedCookie = decodeURIComponent(encodedCookie);
        const cookieObj = JSON.parse(decodedCookie);
        return cookieObj;
    }
};

export const deleteCookie = (name) => {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1); // thiết lập thời gian hết hạn của cookie là ngày hôm trước

    const cookie = `${name}=;expires=${expireDate.toUTCString()};path=/`;
    document.cookie = cookie; // thiết lập cookie
};
