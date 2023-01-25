import { useRef, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Link } from "react-scroll"

import { DetailsSidebar } from "../cmps/details/details-sidebar"
import { OwnerRate } from "../cmps/details/owner-rate"
import { Reviews } from "../cmps/details/reviews"
import { OwnerProfile } from "../cmps/details/owner-profile"

import { FaHeart } from "react-icons/fa"

import { gigService } from "../services/gig.service"
import { showErrorMsg } from "../services/event-bus.service"
import { useSelector } from "react-redux"
import { Breadcrumds } from "../cmps/breadcrumds"

export function GigDetails({ elApp }) {
    const navigate = useNavigate()
    const { gigId } = useParams()
    const [gig, setGig] = useState(null)
    const { filterBy } = useSelector((storeState) => storeState.gigModule)

    useEffect(() => {
        loadGig()
    }, [])

    async function loadGig() {
        try {
            const gig = await gigService.get(gigId)
            setGig(gig)
            //TODO:add msg
        } catch (err) {
            showErrorMsg()
            navigate('/gig')
        }
    }

    if (!gig) return <p>Loading...</p>

    return (
        <section className="gig-details ">
            <div className="details-nav main-layout full">
                <div className="flex space-between">
                    <ul className="flex">
                        <Link activeClass="active" smooth spy to="overview" offset={-50} >
                            <li>
                                Overview
                            </li >
                        </Link>
                        <Link activeClass="active" smooth spy to="gig-description" offset={-50} >
                            <li>
                                Description
                            </li >
                        </Link>
                        <Link activeClass="active" smooth spy to="about-the-seller" offset={-50} >
                            <li>
                                About The Seller

                            </li >
                        </Link>
                        {gig.reviews.length &&
                            <Link activeClass="active" smooth spy to="reviews" offset={-50}>
                                <li>

                                    Reviews
                                </li>
                            </Link>
                        }
                    </ul>
                    <div className="wish-list flex align-center">
                        <button className="add-wishlist"> <FaHeart /></button>
                        {/* <span className="count-wishlist">{gig.likedByUsers.length}</span> */}
                        <span className="count-wishlist">14</span>
                    </div>
                </div>
            </div>
            <section className="gig-details-container flex">
                <div className="details-layout flex">
                    <section className="main">
                        <span id="overview">
                            <Breadcrumds filterBy={filterBy} />
                            <h1>{gig.title}</h1>
                            <div className="mini-owner flex">
                                <img className="owner-img" src={gig.owner.imgUrl} />
                                <div className=" flex">

                                    <p className="owner-name">{gig.owner.fullname}</p>
                                    <p className="owner-level">{gig.owner.level}</p>
                                    <p className="separator">|</p>
                                    <div className="owner-rate flex align-center"><OwnerRate count={gig.reviews.length} rate={gig.rate} /> </div>
                                </div>
                            </div>
                            <div className="img-container">
                                <img className="main-img" src={gig.imgUrl[0]} />
                            </div>
                            {gig.reviews.length && <div className="reviews-snippet">
                                <header className="flex space-between">
                                    <h2>What people loved about this seller</h2>
                                    <Link smooth spy to="reviews" offset={-50}>
                                        <button className='open-btn'>See all reviews</button>
                                    </Link>
                                </header>
                                <div className="reviews-carousel">
                                    {/* //TODO: reviews-carousel!!! */}
                                </div>
                            </div>}
                        </span>
                        <div id="gig-description" className="about">
                            <h2>About This Gig</h2>
                            <p>{gig.description}</p>
                        </div>
                        <span id="about-the-seller"><OwnerProfile gig={gig} /></span>
                        {gig.reviews.length && <span id="reviews" ><Reviews elApp={elApp} gig={gig} /></span>}
                    </section>
                    <DetailsSidebar gig={gig} />
                </div>
            </section>
        </section>
    )
}