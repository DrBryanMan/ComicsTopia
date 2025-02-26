
import Navigo from "https://cdn.jsdelivr.net/npm/navigo@8/+esm"

const router = new Navigo('/', { hash: true })
router
    .on('/articles/characters/:character', (match) => {
        renderPage('characters', match.data.character)
    })
    .on('/articles/comics/:comics', (match) => {
        const comics_name = match.data.comics.split(' Том')[0] // Дивовижна Людина-павук
        let vol = match.data.comics.split('Том ')[1] // 1_1 або 1
        let issue
        if (vol.length > 1) {
            [vol, issue] = vol.split(' ')
            console.log(vol, issue)
            renderPageData('issue', match.data.comics, comics_name, vol, issue)
        } else {
            renderPageData('comics', match.data.comics, comics_name, vol)
        }
    })
    .resolve()