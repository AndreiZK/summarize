import { useState, useEffect } from "react"
import { copy, linkIcon, loader, tick} from '../assets'

import { useLazyGetSummaryQuery } from "../redux/article" 

function Demo() {

    const [article, setArticle] = useState({
        url: '',
        summary: ''
    })
    const [allArticles, setAllArticles] = useState([])
    const [copied, setCopied] = useState('')

    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()

    useEffect(() => {
        const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'))


        if (articlesFromLocalStorage) {
            setAllArticles(articlesFromLocalStorage)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = await getSummary({articleUrl: article.url})

        console.log(data.isSuccess)   
        
        if (data?.data.summary) {

            const summary = data.data.summary

            const newArticle = {...article, summary}
            const updatedAllArticles = [...allArticles, newArticle]

            setAllArticles(updatedAllArticles)
            setArticle(newArticle)

            localStorage.setItem('articles', JSON.stringify(updatedAllArticles))            
        }
    }

    const handleChange = (e) => {
        setArticle({...article, url: e.target.value})
    }

    const handleCopy = (copyUrl, e) => {
        e.stopPropagation()
        setCopied(copyUrl)
        navigator.clipboard.writeText(copyUrl)

        setTimeout(() => setCopied(false), 3000)
    }

    return (
        <section className="mt-16 w-full max-w-xl">
            <div className="flex flex-col w-full gap-2">
                <form 
                    className="flex justify-center items-center relative"
                    onSubmit={handleSubmit}>

                    <img src={linkIcon} alt="link_icon" className="absolute left-0 my-2 ml-3 w-5"/>

                    <input 
                        type="url" 
                        name="" 
                        placeholder="Enter a URL" 
                        value={article.url} 
                        onChange={handleChange} required
                        className="url_input peer-focus:border-gray-700 peer-focus:text-gray-700"
                        />
                    
                    <button
                        type="sibmit"
                        className="submit_btn"
                    >
                        submit
                    </button>
                </form>

                <div className="flex flex-col gap-1 max-h-60">
                    {allArticles.map((thisArticle, i) => (
                        <div 
                            key={`link-${i}`}
                            onClick={() => setArticle(thisArticle)}
                            className='link_card'
                        >
                            <div className="copy_btn" onClick={(e) => handleCopy(thisArticle.url, e)}>
                                <img src={copied === thisArticle.url ? tick : copy} alt="copy-icon" className="w-40 h-40 object-contain"/>
                            </div>
                            <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">{thisArticle.url}</p>
                        </div>
                    ))}
                </div>
                <div className="my-10 max-w-full flex justify-center items-center">
                    {isFetching ? (
                        <img src={loader} alt="loader" className="w-20 h-20 object-contain"/>
                    ) : error ? (<p className="font-inter font-bold text-black text-center">
                        Well, that wasn't supposed to happen...
                        <br />
                        <span className="font-satoshi text-gray-700">{error?.data?.error}</span>
                        </p>) : (
                            article.summary && (
                                <div className="flex flex-col gap-3">
                                    <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                                        Article <span className="blue_gradient">Summary</span>
                                    </h2>
                                    <div className="summary-box">
                                        <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
                                    </div>
                                </div>
                            )
                        )}
                </div>
            </div>
        </section>
    )
}

export default Demo