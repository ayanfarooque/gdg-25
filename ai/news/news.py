import os
import requests
import streamlit as st

# Fetch API key from environment variable
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

if not NEWS_API_KEY:
    st.error("API Key not found. Please set the NEWS_API_KEY environment variable.")
    st.stop()  # Stop execution if API key is missing

# Custom CSS to style the app layout and navigation
st.markdown(
    """
    <style>
        .stApp {
            background-color: #ECE7CA;
        }
        [data-testid="stSidebar"] {
            background-color: #49ABB0;
            padding-top: 0px;
            margin-top: -50px;
        }
        .sidebar-title {
            font-size: 22px;
            font-weight: bold;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .nav-links {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
        }
        .nav-links a {
            text-decoration: none;
            color: white;
            font-size: 18px;
            font-weight: bold;
            width: 150px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.2);
        }
        .nav-links a:hover {
            background-color: rgba(255, 255, 255, 0.4);
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Sidebar to select the news category
st.sidebar.markdown('<div class="sidebar-title">📰 Select News Category</div>', unsafe_allow_html=True)

# News categories
categories = {
    "Artificial Intelligence": "AI",
    "Education": "Education",
    "NEET/JEE": "NEET/JEE",
    "Physics": "Physics"
}

# Dropdown for category selection
selected_category = st.sidebar.selectbox("Choose a category", [""] + list(categories.keys()))

# Navigation links in the sidebar
st.sidebar.markdown(
    """
    <div class="nav-links">
        <a href="#">🏠 Home</a>
        <a href="#">📚 Assignments</a>
        <a href="#">👤 Profile</a>
    </div>
    """,
    unsafe_allow_html=True
)

# Function to fetch news articles
def fetch_news(query):
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&apiKey={NEWS_API_KEY}"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200 and "articles" in data and data["articles"]:
            return data["articles"]
        else:
            return []
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to fetch news: {str(e)}")
        return []

# Function to display news articles
def display_news(news_articles):
    if news_articles:
        for article in news_articles[:5]:
            title = article.get("title", "No Title Available")
            description = article.get("description", "No description available.")
            url = article.get("url", "#")
            image_url = article.get("urlToImage", "https://via.placeholder.com/400")

            st.image(image_url, width=400)
            st.markdown(f"### {title}")
            st.write(description)
            st.markdown(f"[Read more]({url})")
            st.markdown("---")
    else:
        st.warning("No relevant news found.")

# Main content display
if selected_category == "":
    st.title("📰 Latest News on Technology & Education")
    st.subheader("📌 Recommended for You")
    recommended_category = "Physics"
    recommended_articles = fetch_news(recommended_category)

    if recommended_articles:
        for article in recommended_articles[:3]:
            title = article.get("title", "No Title Available")
            url = article.get("url", "#")
            image_url = article.get("urlToImage", "https://via.placeholder.com/400")

            st.image(image_url, width=300)
            st.markdown(f"#### {title}")
            st.markdown(f"[Read more]({url})")
            st.markdown("---")
    else:
        st.warning("No recommended articles found.")
else:
    st.title(f"📰 {selected_category} News")

    if selected_category == "NEET/JEE":
        neet_jee_news = fetch_news('"NEET exam" OR "JEE exam" OR "NTA JEE" OR "JEE Main" OR "JEE Advanced"')
        if neet_jee_news:
            display_news(neet_jee_news)
        else:
            st.warning("No NEET/JEE-related news found. Showing fallback news...")
            fallback_news = fetch_news('"NEET" OR "JEE Main" OR "JEE Advanced" OR "NTA JEE"')
            display_news(fallback_news)
    elif selected_category == "Education":
        education_news = fetch_news("Education")
        if education_news:
            display_news(education_news)
        else:
            st.warning("No education-related news found. Showing fallback news...")
            fallback_news = fetch_news('"Education" OR "schooling"')
            display_news(fallback_news)
    else:
        category_news = fetch_news(categories[selected_category])
        if category_news:
            display_news(category_news)
        else:
            st.warning(f"No news found for {selected_category}. Showing fallback news...")
            fallback_news = fetch_news("JEE OR NEET")
            display_news(fallback_news)
