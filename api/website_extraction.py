import requests
from readability import Document
import html2text
import re

# response = requests.get('https://www.law.cornell.edu/wex/search_warrant')
# response = requests.get('https://en.wikipedia.org/wiki/Mathematics')
# response = requests.get('https://www.yalelawjournal.org/note/amazons-antitrust-paradox')
# response = requests.get('https://er.educause.edu/articles/2022/7/quantum-computing-current-progress-and-future-directions')
class WebsiteTextExtracter:
    def __init__(self, summary_content_cutoff=100):
        self.htmlParser = html2text.HTML2Text()
        self.htmlParser.ignore_images = True
        self.htmlParser.ignore_links = True

        # Crude heuristic to determine if html2text failed summary parsing
        # See first link for an example
        self.summary_content_cutoff = summary_content_cutoff

    def get_site_content(self, url):
        try: 
            response = requests.get(url)
            doc = Document(response.content)
            return doc
        except requests.exceptions.RequestException as e:
            print(e)

    def remove_escape_sequences(self, text):
        # return re.sub(r'(\\n)(\\t)*', ' ', text)
        return re.sub(r'\\[n|t]\s*', '\n\n', text)
    
    def remove_excess_whitespace(self, text):
        return re.sub(r'\n\s*\n', '\n\n', text)

    def remove_garbage_text(self, text):
        # text = text.replace('\\n', '')
        # text = text.replace('\\t', '')
        # cleaned_text = re.sub(r'\n\s*\n', '\n\n', text)

        return self.remove_excess_whitespace(self.remove_escape_sequences(text))
    
    def num_tokens(self, text):
        return len(text.split(' '))
    
    def extract_formatted_text(self, url):
        site_content = self.get_site_content(url)

        # First try to get doc.summary because of better formatting
        # Otherwise get content. 
        #TODO: figure out why this is fucked
        text = self.htmlParser.handle(site_content.summary())
        if self.num_tokens(text) < 100:
            text = self.htmlParser.handle(site_content.content())
        cleaned_text = self.remove_garbage_text(text)

        return cleaned_text
    

