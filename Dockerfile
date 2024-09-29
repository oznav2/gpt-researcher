FROM python:3.11.4-slim-bullseye AS install-browser

RUN apt-get update \
    && apt-get satisfy -y \
    "chromium, chromium-driver (>= 115.0)" \
    && chromium --version && chromedriver --version

RUN apt-get update \
    && apt-get install -y --fix-missing firefox-esr wget \
    && wget https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-linux64.tar.gz \
    && tar -xvzf geckodriver* \
    && chmod +x geckodriver \
    && mv geckodriver /usr/local/bin/

# Install build tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

FROM install-browser AS gpt-researcher-install

ENV PIP_ROOT_USER_ACTION=ignore

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./multi_agents/requirements.txt ./multi_agents/requirements.txt
RUN pip install -r multi_agents/requirements.txt

FROM gpt-researcher-install AS gpt-researcher


ARG OPENAI_API_KEY
ARG TAVILY_API_KEY
ARG GOOGLE_API_KEY
ARG GOOGLE_CX_KEY
ARG BING_API_KEY
ARG SERPAPI_API_KEY
ARG SERPER_API_KEY
ARG LANGCHAIN_API_KEY
ARG SEARCHAPI_API_KEY
ARG ANTHROPIC_API_KEY
ARG NCBI_API_KEY
ARG EXA_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL

ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV TAVILY_API_KEY=${TAVILY_API_KEY}
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}
ENV GOOGLE_CX_KEY=${GOOGLE_CX_KEY}
ENV BING_API_KEY=${BING_API_KEY}
ENV SERPAPI_API_KEY=${SERPAPI_API_KEY}
ENV SERPER_API_KEY=${SERPER_API_KEY}
ENV LANGCHAIN_API_KEY=${LANGCHAIN_API_KEY}
ENV SEARCHAPI_API_KEY=${SEARCHAPI_API_KEY}
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ENV NCBI_API_KEY=${NCBI_API_KEY}
ENV EXA_API_KEY=${EXA_API_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN useradd -ms /bin/bash gpt-researcher \
    && chown -R gpt-researcher:gpt-researcher /usr/src/app

USER gpt-researcher

COPY --chown=gpt-researcher:gpt-researcher ./ ./

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
