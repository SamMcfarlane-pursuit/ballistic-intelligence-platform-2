-- Funding Tracker Database Schema

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    headquarters VARCHAR(255),
    founded_year INTEGER,
    employee_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(normalized_name)
);

-- Investors table
CREATE TABLE IF NOT EXISTS investors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- VC, Angel, Corporate, etc.
    website VARCHAR(255),
    description TEXT,
    headquarters VARCHAR(255),
    aum BIGINT, -- Assets under management
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(normalized_name)
);

-- Funding rounds table
CREATE TABLE IF NOT EXISTS funding_rounds (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    round_type VARCHAR(50) NOT NULL,
    amount_usd BIGINT NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    announced_date DATE NOT NULL,
    valuation_usd BIGINT,
    pre_money_valuation BIGINT,
    post_money_valuation BIGINT,
    source VARCHAR(50) NOT NULL,
    source_url VARCHAR(500),
    article_title VARCHAR(500),
    confidence_score DECIMAL(3,2),
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Funding round investors (many-to-many relationship)
CREATE TABLE IF NOT EXISTS funding_round_investors (
    id SERIAL PRIMARY KEY,
    funding_round_id INTEGER REFERENCES funding_rounds(id) ON DELETE CASCADE,
    investor_id INTEGER REFERENCES investors(id),
    role VARCHAR(20) NOT NULL, -- lead, participant, follow-on
    investment_amount BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(funding_round_id, investor_id)
);

-- Data sources tracking
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- scraper, api, manual
    url VARCHAR(255),
    last_scraped TIMESTAMP,
    total_articles INTEGER DEFAULT 0,
    successful_extractions INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scraped articles for deduplication
CREATE TABLE IF NOT EXISTS scraped_articles (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    title VARCHAR(500),
    content_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for deduplication
    published_date TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    funding_round_id INTEGER REFERENCES funding_rounds(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(url),
    UNIQUE(content_hash)
);

-- Investor networks (relationships between investors)
CREATE TABLE IF NOT EXISTS investor_networks (
    id SERIAL PRIMARY KEY,
    investor_a_id INTEGER REFERENCES investors(id),
    investor_b_id INTEGER REFERENCES investors(id),
    co_investment_count INTEGER DEFAULT 1,
    total_co_investment_amount BIGINT DEFAULT 0,
    first_co_investment DATE,
    last_co_investment DATE,
    relationship_strength DECIMAL(3,2), -- 0.0 to 1.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(investor_a_id, investor_b_id),
    CHECK(investor_a_id < investor_b_id) -- Ensure consistent ordering
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_normalized_name ON companies(normalized_name);
CREATE INDEX IF NOT EXISTS idx_investors_normalized_name ON investors(normalized_name);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_company_id ON funding_rounds(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_announced_date ON funding_rounds(announced_date);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_amount ON funding_rounds(amount_usd);
CREATE INDEX IF NOT EXISTS idx_funding_round_investors_round_id ON funding_round_investors(funding_round_id);
CREATE INDEX IF NOT EXISTS idx_funding_round_investors_investor_id ON funding_round_investors(investor_id);
CREATE INDEX IF NOT EXISTS idx_scraped_articles_content_hash ON scraped_articles(content_hash);
CREATE INDEX IF NOT EXISTS idx_scraped_articles_processed ON scraped_articles(processed);

-- Views for common queries
CREATE OR REPLACE VIEW funding_rounds_with_details AS
SELECT 
    fr.id,
    fr.round_type,
    fr.amount_usd,
    fr.announced_date,
    fr.valuation_usd,
    fr.source,
    fr.confidence_score,
    c.name as company_name,
    c.industry,
    c.headquarters,
    COALESCE(
        STRING_AGG(
            CASE WHEN fri.role = 'lead' THEN i.name END, 
            ', ' ORDER BY i.name
        ), 
        ''
    ) as lead_investors,
    COALESCE(
        STRING_AGG(
            CASE WHEN fri.role = 'participant' THEN i.name END, 
            ', ' ORDER BY i.name
        ), 
        ''
    ) as participating_investors
FROM funding_rounds fr
JOIN companies c ON fr.company_id = c.id
LEFT JOIN funding_round_investors fri ON fr.id = fri.funding_round_id
LEFT JOIN investors i ON fri.investor_id = i.id
GROUP BY fr.id, c.name, c.industry, c.headquarters;

-- Function to normalize company/investor names for deduplication
CREATE OR REPLACE FUNCTION normalize_name(input_name TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(input_name, '\s+(Inc|LLC|Corp|Ltd|Co|LP|LLP)\.?\s*$', '', 'gi'),
                '[^a-zA-Z0-9\s]', '', 'g'
            ),
            '\s+', ' ', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate investor network strength
CREATE OR REPLACE FUNCTION calculate_network_strength(
    co_investment_count INTEGER,
    total_amount BIGINT,
    days_span INTEGER
) RETURNS DECIMAL(3,2) AS $$
BEGIN
    -- Simple algorithm: combines frequency, amount, and recency
    RETURN LEAST(1.0, 
        (co_investment_count * 0.3) + 
        (LEAST(total_amount / 1000000000.0, 1.0) * 0.4) + 
        (CASE WHEN days_span > 0 THEN GREATEST(0, 1.0 - (days_span / 365.0 / 5.0)) ELSE 0 END * 0.3)
    );
END;
$$ LANGUAGE plpgsql;