import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
        <footer className="footer">
        <div className="container foter">
            <div className="row">
                <div className="col-md dev">
                    <h4>Developer</h4>
                    <ul>
                        <li style={{fontSize: '22px'}}>Group A10</li>
                        <li>
                            <Link to="" className="ico-dev" target='_blank' rel='noopener noreferrer'><i className="fa-solid fa-envelope"></i></Link>
                            <Link to="" className="ico-dev" target='_blank'><i className="fa-brands fa-github"></i></Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md">
                    <h4>Socials</h4>
                    <ul>
                        <li>
                            <Link to="" target="_blank" className="ico"><i className='fab fa-linkedin-in'></i></Link>
                        </li>
                        <li>
                            <Link to="groupa10@gmail.com" className="ico"><i className="fab fa-instagram"></i></Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md">
                    <h4>Links & Credits</h4>

                </div>
            </div>
        </div>
    </footer>
        </>
    )
}
