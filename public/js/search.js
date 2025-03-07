modalSearch.onclick = (e) => {
    const {left, right, top, bottom} = modalSearch.getBoundingClientRect()
    !(left <= e.clientX && e.clientX <= right && top <= e.clientY && e.clientY <= bottom) && modalSearch.close()
}