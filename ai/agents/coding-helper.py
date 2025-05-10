from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import google.generativeai as genai
from webdriver_manager.chrome import ChromeDriverManager
import re

class CodingHelpAgent:
    def __init__(self, gemini_api_key):
        service = Service(ChromeDriverManager().install())
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')  # Run in background
        self.driver = webdriver.Chrome(service=service, options=options)
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
    def extract_code_blocks(self, page_source):
        # Look for code in <pre>, <code> tags and markdown code blocks
        code_patterns = [
            r'<pre.*?>(.*?)</pre>',
            r'<code.*?>(.*?)</code>',
            r'```.*?\n(.*?)```',
            r'`(.*?)`'
        ]
        code_blocks = []
        for pattern in code_patterns:
            matches = re.findall(pattern, page_source, re.DOTALL)
            code_blocks.extend(matches)
        return code_blocks

    def analyze_code_solutions(self, search_query):
        try:
            # Search Google
            self.driver.get(f"https://www.google.com/search?q={search_query} code example")
            time.sleep(2)
            
            # Get first 5 results
            results = self.driver.find_elements(By.CSS_SELECTOR, "div.g")[:5]
            all_code = []
            
            for result in results:
                try:
                    link = result.find_element(By.CSS_SELECTOR, "a").get_attribute("href")
                    title = result.find_element(By.CSS_SELECTOR, "h3").text
                    
                    # Open link in new tab
                    self.driver.execute_script(f"window.open('{link}', '_blank')")
                    self.driver.switch_to.window(self.driver.window_handles[-1])
                    
                    # Wait for page load
                    WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    
                    # Extract code content
                    page_content = self.driver.page_source
                    code_blocks = self.extract_code_blocks(page_content)
                    
                    if code_blocks:
                        all_code.append({
                            "title": title,
                            "url": link,
                            "code": code_blocks
                        })
                    
                    self.driver.close()
                    self.driver.switch_to.window(self.driver.window_handles[0])
                    
                except Exception as e:
                    print(f"Error processing result: {str(e)}")
                    continue

            # Analyze collected code using Gemini
            analysis_prompt = f"""
            Analyze these code solutions for: {search_query}
            
            For each solution, provide:
            1. Approach explanation
            2. Key features and implementation details
            3. Advantages and potential drawbacks
            4. Use cases where this approach shines
            5. Performance characteristics
            
            Then provide a summary with:
            1. Best solution recommendation with justification
            2. Alternative approaches and when to use them
            3. Trade-offs between different implementations
            4. Best practices and optimization tips
            
            Format your response in Markdown with code examples and clear sections.
            """
            
            response = self.model.generate_content([analysis_prompt, str(all_code)])
            print("\n=== Code Analysis ===\n")
            print(response.text)
            
        except Exception as e:
            print(f"Error during analysis: {str(e)}")

    def close(self):
        self.driver.quit()

if __name__ == "__main__":
    gemini_api_key = "AIzaSyC1cVYl3qccIPr92vuxKYUtl3fNXvnjvGA"  # Replace with your Gemini API key
    agent = CodingHelpAgent(gemini_api_key)
    
    question = input("Enter your programming question (e.g., 'how to implement GPT attention mechanism in python'): ")
    print("\nSearching and analyzing code solutions...")
    agent.analyze_code_solutions(question)
    agent.close()