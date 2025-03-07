import Navigo from "https://cdn.jsdelivr.net/npm/navigo@8/+esm"
import { loadData } from "./loadData.js"
import { issuePage } from "./issuePageView.js"

const router = new Navigo('/', { hash: true })
router
    .on('/comics/:publisher/:series/:issue', async (match) => {
        const notOneShot = match.data.issue.split('-')[1]
        const [series, vol] = match.data.series.split('-')
        const [issue, type] = match.data.issue.split('-')
        console.log('series:', series, 'vol:', vol, 'issue:', issue, 'type:', type)
        if (issue) {
            let issueData = await loadData('comics', match.data.publisher, series, vol)
            switch (type) {
                case 'annual':
                    console.log('type', type)
                    break
                case 'oneshot':
                    console.log('type', type)
                    break
                default:
                    issueData = issueData.issues.find(i => i.id == issue)
            }
            await issuePage(issueData, match.data.publisher, series, vol, issue)
        } else {
            // Інакше серія комікса
            // loadData('comics', match.data.comics)
            // renderPageData('issue', match.data.comics, comics_name, vol, issue)
        }
    })
    .resolve()