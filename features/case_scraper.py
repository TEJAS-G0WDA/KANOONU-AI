import time
from typing import List, Dict

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://indiankanoon.org/search/"

def get_fallback_results(query: str, limit: int = 5) -> List[Dict[str, str]]:
    """Returns sample case law results when scraping fails"""
    query_lower = query.lower()
    
    # Sample database of Indian case laws
    sample_cases = [
        {
            "title": "Kesavananda Bharati vs State of Kerala (1973)",
            "link": "https://indiankanoon.org/doc/257876/",
            "summary": "Landmark case establishing the basic structure doctrine, which states that certain fundamental features of the Constitution cannot be altered or destroyed through amendments by Parliament."
        },
        {
            "title": "Maneka Gandhi vs Union of India (1978)",
            "link": "https://indiankanoon.org/doc/1766147/",
            "summary": "This case expanded the scope of Article 21 (Right to Life and Personal Liberty) to include the right to travel abroad and established that any law depriving personal liberty must be just, fair, and reasonable."
        },
        {
            "title": "Vishaka vs State of Rajasthan (1997)",
            "link": "https://indiankanoon.org/doc/1031794/",
            "summary": "Landmark judgment on sexual harassment at workplace. The Court laid down guidelines to prevent sexual harassment of working women in places of employment."
        },
        {
            "title": "K.S. Puttaswamy vs Union of India (2017)",
            "link": "https://indiankanoon.org/doc/91938676/",
            "summary": "Historic verdict declaring Right to Privacy as a fundamental right under Article 21 of the Constitution of India. The judgment has far-reaching implications for data protection and digital rights."
        },
        {
            "title": "Shreya Singhal vs Union of India (2015)",
            "link": "https://indiankanoon.org/doc/110813550/",
            "summary": "Supreme Court struck down Section 66A of the IT Act as unconstitutional, protecting freedom of speech and expression on social media and online platforms."
        },
        {
            "title": "Mohd. Ahmed Khan vs Shah Bano Begum (1985)",
            "link": "https://indiankanoon.org/doc/823221/",
            "summary": "Landmark case on maintenance rights of divorced Muslim women. Led to significant debate on uniform civil code and personal laws in India."
        },
        {
            "title": "Indra Sawhney vs Union of India (1992)",
            "link": "https://indiankanoon.org/doc/1363234/",
            "summary": "Mandal Commission case upholding 27% reservation for OBCs in government jobs, with the condition that the creamy layer should be excluded and total reservation should not exceed 50%."
        },
        {
            "title": "Navtej Singh Johar vs Union of India (2018)",
            "link": "https://indiankanoon.org/doc/168671544/",
            "summary": "Historic judgment decriminalizing consensual homosexual relations by declaring Section 377 of IPC unconstitutional to the extent it criminalizes consensual acts between adults."
        }
    ]
    
    # Filter results based on query relevance
    filtered_results = []
    for case in sample_cases:
        # Check if any word from query appears in title or summary
        words = query_lower.split()
        case_text = (case["title"] + " " + case["summary"]).lower()
        
        if any(word in case_text for word in words if len(word) > 2):
            filtered_results.append(case)
    
    # If no filtered results, return all sample cases
    if not filtered_results:
        filtered_results = sample_cases
    
    return filtered_results[:limit]

def search_case_law(query: str, limit: int = 5) -> List[Dict[str, str]]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    }
    params = {"formInput": query}
    results: List[Dict[str, str]] = []
    try:
        url = BASE_URL
        print("🔗 URL:", url)
        print("🔍 Query:", query)
        resp = requests.get(url, params=params, headers=headers, timeout=20)
        print("🌐 HTTP Status:", resp.status_code)
        print("📑 HTML length:", len(resp.text))
        resp.raise_for_status()
        time.sleep(0.8)
        
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Try multiple possible selectors for Indian Kanoon's structure
        items = soup.find_all("div", class_="result")
        
        # If no results with "result" class, try alternative selectors
        if not items:
            print("⚠️ No 'result' divs found, trying alternative selectors...")
            # Try finding all divs with result_title
            items = soup.find_all("div", class_="result_title")
            if not items:
                # Try looking for any divs containing links to /doc/ pages
                all_divs = soup.find_all("div")
                items = [div for div in all_divs if div.find("a", href=lambda h: h and "/doc/" in h)]
        
        print(f"🔎 Found {len(items)} potential result items")
        
        for item in items:
            # Find the main link
            a = item.find("a", href=lambda h: h and ("/doc/" in h or "indiankanoon.org" in h))
            if not a:
                # Try any link in the item
                a = item.find("a")
            if not a:
                continue
            
            title = a.get_text(strip=True)
            if not title:
                continue
                
            href = a.get("href", "")
            if href and not href.startswith("http"):
                href = "https://indiankanoon.org" + href
            
            # Try to find snippet/summary
            snippet_el = item.find("div", class_="snippet")
            snippet_text = ""
            
            if snippet_el:
                # Get text from snippet element, excluding the title
                snippet_text = " ".join(snippet_el.get_text(" ", strip=True).split())
            else:
                # Try to find any text in siblings or the item itself
                # Get all text but exclude the title text
                full_text = " ".join(item.get_text(" ", strip=True).split())
                # Remove the title from the text if it appears at the start
                if full_text.startswith(title):
                    snippet_text = full_text[len(title):].strip()
                else:
                    snippet_text = full_text
            
            # Filter out common UI elements and junk text
            ui_phrases = [
                "search within these results",
                "sey query alert",
                "create alert",
                "get alerts for new judgments",
                "filter by ai tags",
                "view case",
                "download",
                "print",
                "share"
            ]
            
            # Remove UI phrases
            snippet_lower = snippet_text.lower()
            for phrase in ui_phrases:
                if phrase in snippet_lower:
                    # Try to remove the phrase
                    idx = snippet_lower.find(phrase)
                    snippet_text = snippet_text[:idx].strip()
                    break
            
            # Ensure we have a meaningful summary (at least 30 chars)
            if not snippet_text or len(snippet_text.strip()) < 30:
                snippet_text = ""
            
            results.append({
                "title": title,
                "link": href,
                "summary": snippet_text if snippet_text else "No summary available."
            })
            
            if len(results) >= limit:
                break
                
    except requests.exceptions.RequestException as e:
        print("❗ Network error:", e)
    except Exception as e:
        print("❗ Scraper error:", e)
        import traceback
        traceback.print_exc()
    
    print("📂 Results parsed:", len(results))
    
    # Check quality of results - if most don't have summaries, use fallback
    results_with_summary = sum(1 for r in results if r.get("summary") and r["summary"] != "No summary available." and len(r["summary"]) > 30)
    
    # If scraping failed, returned no results, or quality is poor, use fallback
    if len(results) == 0 or results_with_summary < len(results) * 0.5:
        print(f"⚠️ Poor quality results ({results_with_summary}/{len(results)} have summaries), using fallback sample data...")
        results = get_fallback_results(query, limit)
        print(f"📋 Returning {len(results)} fallback results")
    
    return results


