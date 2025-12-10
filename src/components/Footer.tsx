import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const Footer = () => {
    console.log("Footer RENDER");
    return (
        <footer
            className="relative z-50"
            style={{ background: "#1e2a38", color: "#fff", padding: "40px 0" }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                <h2 style={{ fontSize: "22px", marginBottom: "25px" }}>
                    NUTRITION & MEAL ANALYSIS PLATFORM
                </h2>

                {/* GRID 4 COLUMNS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "40px",
                    }}
                >
                    {/* COLUMN 1: ABOUT */}
                    <div>
                        <h3>ABOUT US</h3>
                        <p>Your trusted platform for nutrition insights.</p>
                        <p>Track food. Scan meals. Improve your daily diet.</p>
                        <p>Email: support@nutritionapp.com</p>
                    </div>

                    {/* COLUMN 2: FEATURES */}
                    <div>
                        <h3>FEATURES</h3>
                        <p>Meal Scanner</p>
                        <p>Food Search</p>
                        <p>Personal Goals</p>
                        <p>Nutrition Reports</p>
                    </div>

                    {/* COLUMN 3: SUPPORT */}
                    <div>
                        <h3>SUPPORT</h3>
                        <p>FAQ</p>
                        <p>User Guide</p>
                        <p>Contact Support</p>
                        <p>Privacy & Terms</p>
                    </div>

                    {/* COLUMN 4: SOCIAL */}
                    <div>
                        <h3>FOLLOW US</h3>
                        <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                            <FaFacebookF size={22} />
                            <FaInstagram size={22} />
                            <FaYoutube size={22} />
                            <FaTiktok size={22} />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "40px",
                        opacity: 0.7,
                        fontSize: "14px",
                    }}
                >
                    © {new Date().getFullYear()} Nutrition App — Eat Smarter, Live Better.
                </div>

            </div>
        </footer>
    );
};


export default Footer;
