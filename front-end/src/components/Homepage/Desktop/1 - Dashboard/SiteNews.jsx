import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

import {
  GetCookies,
  SetCookies,
} from "../../../../CustomFunctions/HandleCookies";

import harrold from "../../../../assets/images/Dashboard-images/Harrold.png";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const SiteNews = ({}) => {
  const [siteNews, setSiteNews] = useState(null);
  const [siteNewsLoading, setSiteNewsLoading] = useState(true);
  const [siteNewsError, setSiteNewsError] = useState(null);

  useEffect(() => {
    getSiteNews();
  }, []);

  const getSiteNews = async () => {
    return axios
      .get(`${API}/news`)
      .then((res) => {
        setSiteNews(res.data.payload);
      })
      .catch((err) => {
        setSiteNewsError(err.response.data.error);
      })
      .finally(() => {
        setSiteNewsLoading(false);
      });
  };

  const convertDateToHuman = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const getOrdinalSuffix = (n) => {
      if (n >= 11 && n <= 13) return `${n}th`;
      switch (n % 10) {
        case 1:
          return `${n}st`;
        case 2:
          return `${n}nd`;
        case 3:
          return `${n}rd`;
        default:
          return `${n}th`;
      }
    };

    return `${month} \n ${getOrdinalSuffix(day)} \n ${year}`;
  };

  const renderSiteNews = () => {
    if (siteNewsLoading) {
      return <p>Loading site news...</p>;
    } else if (siteNewsError) {
      return <p>Error loading site news: {siteNewsError}</p>;
    } else {
      siteNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return siteNews.map((news) => {
        return (
          <div key={news.id} className="site-news-post-container">
            <h4 className="site-news-post-title">{news.title}</h4>
            <p className="site-news-post-content">{news.content}</p>
            <p className="site-news-post-date">
              {convertDateToHuman(new Date(news.created_at))}
            </p>
          </div>
        );
      });
    }
  };

  return (
    <div className="site-news-container">
      <div className="site-news-card">
        <div className="site-news-card-header">
          <Image
            src={harrold}
            alt="harrold-site-news-card"
            id="site-news-cloud"
          />
          <h3>Site News</h3>
        </div>

        <div className="site-news-card-content">{renderSiteNews()}</div>
      </div>
    </div>
  );
};
