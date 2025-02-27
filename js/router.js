import Navigo from "https://cdn.jsdelivr.net/npm/navigo@8/+esm"
import { loadData } from "./loadData.js"
import * as View from "./Views.js"
// const comicsPath = './public/articles/comics'

const router = new Navigo('/', { hash: true })
router
    .on('/comics/:publisher/:id', async (match) => {
        const notOneShot = match.data.id.split('-')[1]
        const [series, vol, issue] = match.data.id.split('-')
            console.log('series:', series, 'vol:', vol, 'issue:', issue)
        if (vol.split('-')[1]) {
                console.log('vol:', vol, 'issue:', issue)
            // loadData('comics', match.data.comics)
            // renderPageData('issue', match.data.comics, comics_name, vol, issue)
        } else {
            const comicsData = await loadData('comics', match.data.publisher, series, vol)
                console.log('issue:', issue)
                console.log('comicsData:', comicsData)
            View.issuePage(comicsData, series, vol, issue)
        }
        if (notOneShot) {
            console.log('ComicsSeries')
            // loadData('comics', match.data.id)
        } else {
            console.log('OneShot')
            // loadData('comics', match.data.id)
        }
    })
    .resolve()