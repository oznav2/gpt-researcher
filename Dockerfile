# Stage 1: Browser and build tools installation
FROM python:3.11.4-slim-bullseye AS install-browser

# Install Chromium, Chromedriver, Firefox, Geckodriver, and build tools in one layer
RUN apt-get update && \
    apt-get satisfy -y "chromium, chromium-driver (>= 115.0)" && \
    apt-get install -y --no-install-recommends firefox-esr wget build-essential && \
    wget https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-linux64.tar.gz && \
    tar -xvzf geckodriver-v0.33.0-linux64.tar.gz && \
    chmod +x geckodriver && \
    mv geckodriver /usr/local/bin/ && \
    rm geckodriver-v0.33.0-linux64.tar.gz && \
    chromium --version && chromedriver --version && \
    rm -rf /var/lib/apt/lists/*  # Clean up apt lists to reduce image size

# Stage 2: Python dependencies installation
FROM install-browser AS gpt-researcher-install

ENV PIP_ROOT_USER_ACTION=ignore
WORKDIR /usr/src/app

# Copy and install Python dependencies in a single layer to optimize cache usage
COPY ./requirements.txt ./requirements.txt
COPY ./multi_agents/requirements.txt ./multi_agents/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -r multi_agents/requirements.txt

# Stage 3: Final stage with non-root user and app
FROM gpt-researcher-install AS gpt-researcher


# Create a non-root user for security
RUN useradd -ms /bin/bash gpt-researcher && \
    chown -R gpt-researcher:gpt-researcher /usr/src/app
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
WORKDIR /usr/src/app

# Copy the rest of the application files with proper ownership
COPY --chown=gpt-researcher:gpt-researcher ./ ./

# Expose the application's port
EXPOSE 8000

# Define the default command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
