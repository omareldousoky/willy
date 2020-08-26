const customersTxt = (textData) => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1) < 10 ? (new Date().getMonth() + 1) : `0${(new Date().getMonth() + 1)}`;
    const day = (new Date().getDate() + 1) < 10 ? (new Date().getDate()) : `0${(new Date().getDate())}`
    return `H|${year}${month}${day}|${textData.length}|TDIS_CUS|\n
    hello there
    fi
    `
}


export const downloadTxtFile = (textData) => {
    console.log(textData)
    const element = document.createElement("a");
    const file = new Blob([customersTxt(textData)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "download.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

