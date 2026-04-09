#!/usr/bin/env python3
"""
Read a Google Doc by ID using OAuth2.
First run: opens browser for auth, saves token to assistant_agent/token.json.
Subsequent runs: uses saved token (auto-refreshes).

Usage: python3 read_doc.py <DOC_ID>
"""

import sys
import os
import json

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_FILE = os.path.join(BASE_DIR, "client_secret.json")
TOKEN_FILE = os.path.join(BASE_DIR, "token.json")


def get_credentials():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return creds


def extract_text(doc):
    parts = []
    for element in doc.get("body", {}).get("content", []):
        if "paragraph" in element:
            for pe in element["paragraph"].get("elements", []):
                if "textRun" in pe:
                    parts.append(pe["textRun"]["content"])
        elif "table" in element:
            for row in element["table"].get("tableRows", []):
                for cell in row.get("tableCells", []):
                    for ce in cell.get("content", []):
                        if "paragraph" in ce:
                            for pe in ce["paragraph"].get("elements", []):
                                if "textRun" in pe:
                                    parts.append(pe["textRun"]["content"])
    return "".join(parts).strip()


def read_doc(doc_id):
    creds = get_credentials()
    service = build("docs", "v1", credentials=creds)
    doc = service.documents().get(documentId=doc_id).execute()
    title = doc.get("title", "Untitled")
    text = extract_text(doc)
    print(f"=== {title} ===\n")
    print(text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 read_doc.py <DOC_ID>")
        sys.exit(1)
    read_doc(sys.argv[1])
