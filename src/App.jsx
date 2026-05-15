import { useState, useEffect } from "react";

const CATEGORIES = [
  {
    id: "embedding",
    label: "Embedding",
    description: "Modelle zur Umwandlung von Text in numerische Vektoren fuer semantische Suche",
    items: [
      {
        name: "pplx-embed-context-v1",
        variant: "0.6B / 4B",
        status: "tentativ",
        reason: "Kontextbewusste Embeddings loesen das Chunk-Grenzproblem strukturell. SOTA auf BERGEN RAG-Benchmark. Kein Instruction-Prefix noetig. Lineage-Vorbehalt fuer Klient-sichtbare Spur-A-Mandate offen (TEK-Lineage-Memo + Sample-Bench ausstehend).",
        techDesc: "Bidirektionales Embedding-Modell mit Diffusion-basiertem Pretraining auf Qwen3-Basis. Erzeugt chunk-level Repraesentationen unter Einbezug des Dokumentkontexts (Late Chunking). Native INT8-Quantisierung (4x Speicherreduktion), Binary-Variante (32x). 0.6B fuer Low-Latency, 4B fuer maximale Retrieval-Qualitaet. ConTEB SOTA: 81.96% nDCG@10.",
        noviceDesc: "Stell dir vor, du teilst ein Buch in Abschnitte. Normale Modelle vergessen beim Lesen eines Abschnitts, was vorher stand. Dieses Modell merkt sich den Zusammenhang des ganzen Buches, auch wenn es nur einen Absatz einliest.",
        openSource: true, license: "MIT", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Basis-LLM Qwen3 (Alibaba, China). Re-Release durch Perplexity AI unter MIT mit Diffusion-Continued-Pretraining. Klient-Signal-Risiko bei DSGVO-strikten oder hochsicherheits-zertifizierten Mandaten. Spur-A-Einsatz nur nach Mandats-bezogener Compliance-Pruefung.",
        provider: "Perplexity AI", released: "2026-02-27",
        links: { huggingface: "https://huggingface.co/pplx", docs: "https://docs.perplexity.ai/docs/embeddings/quickstart" }
      },
      {
        name: "pplx-embed-v1",
        variant: "0.6B / 4B",
        status: "tentativ",
        reason: "Standard-Variante ohne Kontextbewusstsein. Relevant fuer Standalone-Queries und Query-Embedding. Lineage-Vorbehalt fuer Klient-sichtbare Spur-A-Mandate offen (TEK-Lineage-Memo + Sample-Bench ausstehend).",
        techDesc: "Dense Retrieval Embedding-Modell fuer unabhaengige Texte und Suchanfragen. Gleiche Architektur wie context-v1, aber ohne Late Chunking. MTEB Multilingual v2: 69.66% nDCG@10 (4B). Matryoshka Representation Learning fuer flexible Dimensionen.",
        noviceDesc: "Die einfachere Version des Perplexity-Modells. Gut fuer einzelne Suchanfragen, aber ohne das Gedaechtnis fuer den Buchkontext.",
        openSource: true, license: "MIT", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Basis-LLM Qwen3 (Alibaba, China). Re-Release durch Perplexity AI unter MIT mit Diffusion-Continued-Pretraining. Klient-Signal-Risiko bei DSGVO-strikten oder hochsicherheits-zertifizierten Mandaten. Spur-A-Einsatz nur nach Mandats-bezogener Compliance-Pruefung.",
        provider: "Perplexity AI", released: "2026-02-27",
        links: { huggingface: "https://huggingface.co/pplx" }
      },
      {
        name: "Octen-Embedding-0.6B",
        variant: "0.6B / LoRA-Fine-Tune",
        status: "aktiv",
        reason: "Aktives cv-rag-Embedding. LoRA-Fine-Tune von Qwen3-Embedding-0.6B durch HPI/Octen-Linie. Bei cv-rag-Bench am 12.05.2026 mit 3,7 pp Vorsprung gegenueber Qwen3-Embedding-0.6B bei 90/10 EN/DE.",
        techDesc: "LoRA-Adaption von Qwen3-Embedding-0.6B. Europaeische akademische Adaption mildert Reputations-Risiko der Qwen3-Lineage teilweise. Spur-B-Setup. RTEB-Beta-Benchmark.",
        noviceDesc: "Eine in Europa angepasste Version des chinesischen Qwen3-Suchmodells. Akademische Schicht (HPI/Octen) auf der Basis von Alibaba.",
        openSource: true, license: "Apache 2.0", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "Lokal ausfuehrbar. Qwen3-Lineage in Basisgewichten. Fuer cv-rag-Spur-B-Einsatz freigegeben. Fuer Spur-A-Mandate-RAGs nicht vorgesehen.",
        provider: "Octen / HPI (LoRA), Alibaba (Basis)", released: "2026",
        links: {}
      },
      {
        name: "Qwen3-Embedding-0.6B",
        variant: "0.6B / 1024-dim",
        status: "evaluiert",
        reason: "Im Direktvergleich mit Octen-Embedding-0.6B am 12.05.2026 fuer cv-rag/eval-methods-rag geprueft. Octen gewichtet vorgezogen (3,7 pp bei 90/10 EN/DE). China-Lineage als Zusatzargument fuer Octen, bei rein operativem Setup kein Showstopper, bei Klient-sichtbaren Mandaten Reputations-Risiko.",
        techDesc: "Bidirektionales Embedding-Modell von Alibaba, Qwen3-Familie. Apache-2.0, open weights, lokal lauffaehig. 0.6B Variante (~596M Params), 1024-dim. Basis fuer Perplexity- und Octen-Adaptionen.",
        noviceDesc: "Das chinesische Original-Suchmodell. Frei verfuegbar und lokal lauffaehig, aber Hersteller ist Alibaba — relevant fuer Klient-Sichtbarkeit.",
        openSource: true, license: "Apache 2.0", country: "CN", countryFlag: "\u{1F1E8}\u{1F1F3}",
        gdprNote: "Lokal ausfuehrbar, keine Daten an Alibaba bei Inferenz. Reputations- und Trainingsdaten-Bias-Risiko bestehen. Fuer Spur-A-Mandate mit DSGVO-strikten oder hochsicherheits-zertifizierten Klienten nicht empfohlen.",
        provider: "Alibaba Cloud", released: "2026",
        links: { huggingface: "https://huggingface.co/Qwen/Qwen3-Embedding-0.6B" }
      },
      {
        name: "mxbai-embed-large-v1",
        variant: "335M / 1024-dim",
        status: "tentativ",
        reason: "Kandidat fuer pipeline-rag Sample-Bench (TEK Memo v1.1). Lineage-saubere Alternative ohne China-Basis, in Berlin entwickelt.",
        techDesc: "BERT-basiertes Sentence-Embedding-Modell von Mixedbread AI (Berlin). 335M Params, 1024 Dimensionen. Apache-2.0, MTEB-kompetitiv (englisch-fokussiert). Multiple Quantisierungen (ONNX, GGUF, OpenVINO).",
        noviceDesc: "Ein Berliner Suchmodell ohne chinesische Vorgeschichte. Mittelgross, englisch-fokussiert, gut etabliert.",
        openSource: true, license: "Apache 2.0", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "Lokal ausfuehrbar. In Berlin entwickelt. Keine Daten an Anbieter bei lokaler Inferenz.",
        provider: "Mixedbread AI (Berlin)", released: "2024",
        links: { huggingface: "https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1" }
      },
      {
        name: "jina-embeddings-v3",
        variant: "572M / Multilingual / Late Chunking",
        status: "tentativ",
        reason: "Kandidat fuer pipeline-rag Sample-Bench (TEK Memo v1.1). Natives Late Chunking, multilingual (DE/EN stark). Lizenz pruefen: CC-BY-NC-4.0 (nicht-kommerziell) — kommerzielle Nutzung erfordert Jina-Lizenz.",
        techDesc: "Multilinguales Embedding-Modell von Jina AI (Berlin). 572M Params, natives Late Chunking, Task-LoRA-Adapter (Retrieval, Classification, Separation, Matching). 100+ Sprachen. Region:eu auf HF.",
        noviceDesc: "Ein Berliner Suchmodell, das viele Sprachen versteht und Buchkapitel zusammenhaengend einliest. Lizenz ist nur fuer Forschung kostenlos — Beratungseinsatz braucht Jina-Vertrag.",
        openSource: true, license: "CC-BY-NC-4.0 (non-commercial)", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "EU-Hosting verfuegbar. Lokal ausfuehrbar. Lizenz: kommerzielle Nutzung (Klienten-Mandate) erfordert separate Jina-Lizenz, nicht direkt produktiv einsetzbar.",
        provider: "Jina AI (Berlin)", released: "2024",
        links: { huggingface: "https://huggingface.co/jinaai/jina-embeddings-v3" }
      },
      {
        name: "EuroBERT",
        variant: "210M / 610M / 2.1B",
        status: "tentativ",
        reason: "Kandidat fuer pipeline-rag Sample-Bench (TEK Memo v1.1) — Pruefen ob direkt als Embedding nutzbar. Base-Architektur ist Fill-Mask (BERT-Stil), Embedding via Pooling-Layer oder separater Fine-Tune noetig. EU-Forschungsprojekt.",
        techDesc: "Multilinguales BERT-Modell aus EU-Forschungsprojekt. 15 Sprachen inkl. DE/EN/FR. Drei Groessen: 210M, 610M, 2.1B Params. HF-Task ist fill-mask, nicht direkt feature-extraction — Embedding-Nutzung erfordert Pooling-Adapter oder Fine-Tune auf Retrieval-Objektiv.",
        noviceDesc: "Ein europaeisches Sprachmodell mit viel deutscher Trainingsbasis. Muss erst fuer Suche angepasst werden, bevor es direkt als Embedding-Modell nutzbar ist.",
        openSource: true, license: "Apache 2.0", country: "EU", countryFlag: "\u{1F1EA}\u{1F1FA}",
        gdprNote: "EU-Forschungsprojekt. Lokal ausfuehrbar. Lineage-sauber. Embedding-Eignung muss durch Sample-Bench bestaetigt werden.",
        provider: "EuroBERT-Konsortium (EU)", released: "2025",
        links: { huggingface: "https://huggingface.co/EuroBERT/EuroBERT-610m" }
      },
      {
        name: "intfloat/multilingual-e5-large",
        variant: "560M / 1024-dim",
        status: "abgeloest",
        reason: "War 2024 SOTA fuer multilinguales Retrieval. Durch pplx-embed ueberholt bei kontextbewusstem Chunking und Quantisierung.",
        techDesc: "Multilinguales Text-Embedding-Modell basierend auf XLM-RoBERTa. 1024 Dimensionen, ~560M Parameter. Gute DE/EN Performance, erfordert Instruction-Prefix ('query:' / 'passage:'). Keine native Quantisierung. Standard im HPI-Workshop und MEARL Pipeline v1-v3.",
        noviceDesc: "Das bisherige Suchmodell unserer Pipeline. Versteht Deutsch und Englisch gut, aber vergisst den Zusammenhang zwischen Abschnitten und braucht mehr Speicherplatz.",
        openSource: true, license: "MIT", country: "CN", countryFlag: "\u{1F1E8}\u{1F1F3}",
        gdprNote: "Lokal ausfuehrbar", provider: "BAAI / Microsoft", released: "2024",
        links: { huggingface: "https://huggingface.co/intfloat/multilingual-e5-large" }
      },
      {
        name: "bge-small-en-v1.5",
        variant: "33M / 384-dim",
        status: "evaluiert",
        reason: "Leichtgewichtiger Kandidat fuer LoRA Fine-Tuning Assessment. Gute Baseline fuer domaeenspezifische Anpassung.",
        techDesc: "Kompaktes englisches Embedding-Modell der BAAI BGE-Familie. 33M Parameter, 384 Dimensionen. Solide MTEB-Performance fuer seine Groesse. Gut geeignet als Fine-Tuning-Basis.",
        noviceDesc: "Ein kleines, schnelles Suchmodell, das man leichter an eigene Fachbegriffe anpassen kann.",
        openSource: true, license: "MIT", country: "CN", countryFlag: "\u{1F1E8}\u{1F1F3}",
        gdprNote: "Lokal ausfuehrbar", provider: "BAAI", released: "2023",
        links: { huggingface: "https://huggingface.co/BAAI/bge-small-en-v1.5" }
      },
      {
        name: "nomic-embed-text-v1.5",
        variant: "137M / 768-dim / 8192 ctx",
        status: "evaluiert",
        reason: "Zweiter Kandidat fuer LoRA Fine-Tuning Assessment (vs bge-small). Zusaetzlich Kandidat fuer pipeline-rag Sample-Bench (TEK Memo v1.1) als Lineage-saubere US-Alternative ohne China-Basis.",
        techDesc: "Open-Source Embedding-Modell von Nomic AI (USA). 137M Parameter, 768 Dimensionen, 8192 Token Kontextlaenge. Trainiert auf kuratierten Daten mit reproduzierbarer Pipeline. Apache 2.0. Matryoshka-Representation.",
        noviceDesc: "Ein mittelgrosses US-Suchmodell mit besonders langem Gedaechtnis. Guter Kompromiss zwischen Geschwindigkeit und Qualitaet. Reproduzierbar trainiert.",
        openSource: true, license: "Apache 2.0", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal ausfuehrbar. US-Anbieter, aber bei lokaler Inferenz keine Datenuebertragung.",
        provider: "Nomic AI", released: "2024",
        links: { huggingface: "https://huggingface.co/nomic-ai/nomic-embed-text-v1.5" }
      }
    ]
  },
  {
    id: "vectordb",
    label: "Vector DB",
    description: "Speicher- und Suchsysteme fuer hochdimensionale Vektordaten",
    items: [
      {
        name: "Qdrant",
        variant: "v1.x / Rust",
        status: "aktiv",
        reason: "Bestes natives Metadata-Filtering (WIS-Tiers, Agent-Zuordnung, Spur-Filter). Filterbares HNSW waehrend des Graph-Traversals. Produktionsreif.",
        techDesc: "Open-Source Vector-Similarity-Suchmaschine in Rust. Filterbares HNSW-Indexing mit Payload-basierter Filterung. JSON-Payloads, numerische Bereiche, Geo-Filter. Horizontale Skalierung, WAL fuer Crash-Recovery. REST + gRPC API.",
        noviceDesc: "Eine spezialisierte Datenbank, die nicht nur schnell sucht, sondern auch gleichzeitig filtern kann. Findet das richtige Dokument UND beruecksichtigt dabei Regale/Kategorien.",
        openSource: true, license: "Apache 2.0", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "In Deutschland entwickelt. Self-hosted. Keine Daten an Dritte.",
        provider: "Qdrant Solutions GmbH (Berlin)", released: "2021",
        links: { website: "https://qdrant.tech", github: "https://github.com/qdrant/qdrant" }
      },
      {
        name: "FAISS + SQLite",
        variant: "IndexFlatIP + FTS5",
        status: "abgeloest",
        reason: "Zwischenloesung nach ChromaDB-Ausfall. Metadata-Filtering erfordert Eigenentwicklung. Durch Qdrant ersetzt.",
        techDesc: "FAISS: C++/Python fuer effiziente Aehnlichkeitssuche. IndexFlatIP fuer exakte Inner-Product-Suche. Kein natives Metadata-Filtering, CRUD, Persistenz. SQLite FTS5 als Volltextindex. Erfordert Custom-Wrapper.",
        noviceDesc: "Ein sehr schneller, aber einfacher Suchalgorithmus. Blitzschnell, aber man muss alles selbst organisieren.",
        openSource: true, license: "MIT", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal ausfuehrbar", provider: "Meta AI Research", released: "2017",
        links: { github: "https://github.com/facebookresearch/faiss" }
      },
      {
        name: "ChromaDB",
        variant: "v0.5+ / Rust-Rewrite",
        status: "abgeloest",
        reason: "Rate-Degradation (18→11 ch/s) und 80 GB Disk bei 5.26M Chunks. Gut fuer Prototyping und Lehre (HPI), nicht fuer Produktion.",
        techDesc: "Open-Source Vektordatenbank mit Metadata-Filtering, Persistenz und CRUD. Python-API. 2025 Rust-Rewrite (4x schneller). Skalierungslimit: ~10M Vektoren. Kein Horizontal Scaling.",
        noviceDesc: "Die einsteigerfreundliche Datenbank aus dem HPI-Kurs. Einfach zu bedienen, aber bei grossen Bestaenden langsam und speicherhungrig.",
        openSource: true, license: "Apache 2.0", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal ausfuehrbar", provider: "Chroma Inc.", released: "2022",
        links: { website: "https://www.trychroma.com", github: "https://github.com/chroma-core/chroma" }
      },
      {
        name: "Milvus",
        variant: "v2.x / Cloud-Native",
        status: "tentativ",
        reason: "Staerkste Option fuer Milliarden-Skala. Overkill aktuell, aber relevant bei massivem Korpuswachstum oder Hetzner-Deployment.",
        techDesc: "Cloud-native Vektordatenbank. Kubernetes-basiert, horizontale Skalierung, Milliarden von Vektoren. Multiple ANN-Index-Typen. Hybrid Search. Zilliz Cloud als Managed Service.",
        noviceDesc: "Die Industrieanlage unter den Vektordatenbanken. Fuer riesige Unternehmen gebaut. Aktuell Overkill, aber gut zu kennen.",
        openSource: true, license: "Apache 2.0", country: "US/CN", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Self-hosted moeglich. Zilliz Cloud in US/EU.",
        provider: "Zilliz / LF AI Foundation", released: "2019",
        links: { website: "https://milvus.io", github: "https://github.com/milvus-io/milvus" }
      },
      {
        name: "Pinecone",
        variant: "Managed Service",
        status: "ausgeschlossen",
        reason: "Proprietaer, kein Self-Hosting. Daten verlassen das System. DSGVO-Risiko. Vendor Lock-in.",
        techDesc: "Fully-managed Vector Database as a Service. Serverless und Pod-basiert. Keine Self-Hosting-Option. Daten auf AWS US/EU.",
        noviceDesc: "Ein Cloud-Dienst, bei dem man die Kontrolle ueber seine Daten abgibt. Fuer sensible Beratungsdaten nicht geeignet.",
        openSource: false, license: "Proprietaer", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Kein Self-Hosting. DSGVO-kritisch.",
        provider: "Pinecone Systems Inc.", released: "2021",
        links: { website: "https://www.pinecone.io" }
      }
    ]
  },
  {
    id: "search",
    label: "Search",
    description: "Such-Algorithmen und Reranking-Komponenten der RAG-Pipeline",
    items: [
      {
        name: "Hybrid Search (Vector + BM25)",
        variant: "RRF Fusion",
        status: "aktiv",
        reason: "Kombiniert semantische Suche mit Keyword-Matching. RRF vereint beide Ergebnislisten. Implementiert in search_v2.py.",
        techDesc: "Parallele Vektor-Suche (Cosine/IP) und BM25 Volltextsuche (SQLite FTS5). Reciprocal Rank Fusion (k=60). Multi-Query Expansion (DE/EN). Deduplizierung auf Dokumentebene.",
        noviceDesc: "Zwei Suchstrategien gleichzeitig: Eine versteht die Bedeutung, die andere sucht exakte Woerter. Zusammen findet man sowohl inhaltlich passende als auch wortwortlich treffende Dokumente.",
        openSource: true, license: "Eigenentwicklung", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "Eigenentwicklung, laeuft lokal", provider: "PERICORE / MEARL Pipeline", released: "2026", links: {}
      },
      {
        name: "WIS-Tier Metadata Filtering",
        variant: "A / B / C",
        status: "aktiv",
        reason: "Dreistufige Dokumentklassifikation: Kernbestand (A), Referenzliteratur (B), Archivmaterial (C). Steuert Retrieval-Praezision.",
        techDesc: "Metadata-Enrichment-Layer in tier_config.py + tier_mapping.yaml. Dokumenttyp-Mapping als Fast Path, Entscheidungsbaum als Fallback. Default: Tier B. Dynamische WHERE-Clauses. Agent-Zuordnung als Filter.",
        noviceDesc: "Ein Ordnungssystem: Wichtigstes in A, Nachschlagewerke in B, Archiv in C. Man kann gezielt nur in den wichtigsten Dokumenten suchen.",
        openSource: true, license: "Eigenentwicklung", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "Eigenentwicklung", provider: "PERICORE / WIS + TEK", released: "2026", links: {}
      }
    ]
  },
  {
    id: "llm",
    label: "LLM & AI",
    description: "Sprachmodelle und AI-Plattformen im PERICORE-Oekosystem",
    items: [
      {
        name: "Claude (Anthropic)",
        variant: "Opus 4.6 / Sonnet 4.6 / Haiku 4.5",
        status: "aktiv",
        reason: "Primaeres LLM fuer alle 9 Agents. Projects, Code, MCP, Console. Backbone des PERICORE-Systems.",
        techDesc: "LLM-Familie von Anthropic. Claude Projects fuer Agent-Konfiguration mit System Prompts und Knowledge Files. Claude Code fuer Terminal-basierte Entwicklung. MCP fuer Tool-Integration. Anthropic Console fuer Prompt-Engineering und Evaluation.",
        noviceDesc: "Das Gehirn hinter allen 9 Agenten. Jeder Agent ist ein Claude-Projekt mit eigenen Anweisungen und Wissen.",
        openSource: false, license: "Proprietaer / API", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Spur-B-Verarbeitung. Keine Spur-A-Inhalte direkt an Claude.",
        provider: "Anthropic", released: "2026",
        links: { website: "https://claude.ai", docs: "https://docs.anthropic.com" }
      },
      {
        name: "Langdock",
        variant: "Enterprise LLM Gateway",
        status: "aktiv",
        reason: "DSGVO-konformer LLM-Zugang fuer Spur-A-nahe Verarbeitung. EU-Hosting. Rollenbasierte Zugriffskontrolle.",
        techDesc: "Enterprise AI Plattform mit DSGVO-konformem Hosting in der EU. Multiple LLM-Backends. RBAC. Audit-Logging. SOC 2 konform.",
        noviceDesc: "Ein europaeischer Dienst, der KI-Modelle unter strengen Datenschutzregeln bereitstellt. Fuer vertrauliche Anfragen.",
        openSource: false, license: "Proprietaer", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "EU-Hosting. DSGVO-konform. Fuer Spur-A-nahe Verarbeitung.",
        provider: "Langdock GmbH (Berlin)", released: "2023",
        links: { website: "https://langdock.com" }
      },
      {
        name: "Ollama",
        variant: "Lokale LLM Runtime",
        status: "aktiv",
        reason: "Lokale Ausfuehrung von Open-Source LLMs fuer Spur-A-Verarbeitung. Null Datenuebertragung.",
        techDesc: "Lokale LLM-Laufzeitumgebung. Llama, Mistral, Phi, Gemma. REST API auf localhost. Optimiert fuer Apple Silicon (Metal). Kein Cloud-Kontakt.",
        noviceDesc: "KI-Modelle direkt auf dem Laptop. Nichts verlasst den Computer. Perfekt fuer vertrauliche Dokumente.",
        openSource: true, license: "MIT", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Vollstaendig lokal. Keine Datenuebertragung.",
        provider: "Ollama Inc.", released: "2023",
        links: { website: "https://ollama.ai", github: "https://github.com/ollama/ollama" }
      },
      {
        name: "Perplexity",
        variant: "Pro / API",
        status: "aktiv",
        reason: "Recherche-LLM mit Echtzeit-Websuche. Deep Research fuer umfassende Analysen. Sonar API fuer programmatischen Zugriff.",
        techDesc: "LLM mit integrierter Websuche und Quellenangaben. Pro-Tier mit Deep Research (mehrstufige Recherche). Sonar API fuer Automatisierung. Pro Search mit Follow-up-Fragen.",
        noviceDesc: "Eine KI-Suchmaschine, die Fragen mit aktuellen Quellen beantwortet. Wie Google, aber die Antwort wird gleich zusammengefasst.",
        openSource: false, license: "Proprietaer / API", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Cloud-basiert. Keine Spur-A-Daten.",
        provider: "Perplexity AI", released: "2024",
        links: { website: "https://perplexity.ai" }
      }
    ]
  },
  {
    id: "devtools",
    label: "Dev Tools",
    description: "Entwicklungswerkzeuge, Laufzeitumgebungen und Code-Infrastruktur",
    items: [
      {
        name: "Python",
        variant: "3.12+ / pyenv / venv",
        status: "aktiv",
        reason: "Primaere Programmiersprache fuer RAG-Pipeline, Embedding-Berechnung, Datenverarbeitung und Automatisierung.",
        techDesc: "Python 3.12+ via pyenv fuer Versionsverwaltung. Virtuelle Umgebungen (venv) pro Projekt. Key-Packages: torch, transformers, sentence-transformers, qdrant-client, chromadb, pandas, numpy, fastapi. pip + requirements.txt fuer Dependency Management.",
        noviceDesc: "Die Programmiersprache, in der unsere gesamte RAG-Pipeline geschrieben ist. Wie die Amtssprache unserer technischen Infrastruktur.",
        openSource: true, license: "PSF License", country: "INT", countryFlag: "\u{1F310}",
        gdprNote: "Lokal ausfuehrbar", provider: "Python Software Foundation", released: "1991",
        links: { website: "https://python.org" }
      },
      {
        name: "Docker",
        variant: "Desktop / Compose",
        status: "aktiv",
        reason: "Containerisierung fuer Qdrant, n8n und andere Services. Reproduzierbare Deployments. Isolation von Abhaengigkeiten.",
        techDesc: "Container-Runtime fuer isolierte Anwendungsumgebungen. Docker Compose fuer Multi-Container-Setups (Qdrant + n8n + Custom Services). Volumes fuer persistente Daten. Bridge-Networking. ARM64-nativ auf Apple Silicon.",
        noviceDesc: "Eine Technologie, die Programme in abgeschlossene Pakete verpackt. Jedes Paket hat alles dabei, was es braucht. Kein Durcheinander auf dem Laptop.",
        openSource: true, license: "Apache 2.0", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal ausfuehrbar. Images von Docker Hub (oeffentlich).",
        provider: "Docker Inc.", released: "2013",
        links: { website: "https://docker.com", github: "https://github.com/docker" }
      },
      {
        name: "Git / GitHub",
        variant: "CLI + GitHub.com",
        status: "aktiv",
        reason: "Versionskontrolle fuer alle Code-Projekte. GitHub fuer Remote-Repos, Issues, Actions. Pflicht laut TEK-Arbeitsprinzip 4.",
        techDesc: "Verteilte Versionskontrolle. GitHub als Remote-Host fuer Repos: rag-pipeline, pericore-automation, beleg-classifier, pericore-invoicing, pericore-techstack. Branch-Strategie: main + feature branches. GitHub Actions fuer CI/CD (geplant).",
        noviceDesc: "Ein System, das jede Aenderung am Code aufzeichnet. Man kann jederzeit zurueckspulen. GitHub ist der Online-Tresor fuer den Code.",
        openSource: true, license: "GPL-2.0 (Git)", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Code-Repos auf GitHub (Spur B). Keine Spur-A-Daten in Repos.",
        provider: "Git (Torvalds) / GitHub (Microsoft)", released: "2005 / 2008",
        links: { website: "https://github.com" }
      },
      {
        name: "VS Code",
        variant: "+ Claude Code Extension",
        status: "aktiv",
        reason: "Primaerer Code-Editor. Claude Code Extension fuer AI-gestuetzte Entwicklung. Terminal-Integration fuer Claude Code CLI.",
        techDesc: "Electron-basierter Code-Editor. Extensions: Claude Code (Anthropic), Python, Docker, GitLens, Remote-SSH (Hetzner). Integriertes Terminal fuer Claude Code CLI. Settings Sync ueber GitHub.",
        noviceDesc: "Der Arbeitsplatz fuer Programmierer. Mit eingebauter KI-Unterstuetzung durch Claude Code.",
        openSource: true, license: "MIT", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal. Telemetrie abschaltbar.",
        provider: "Microsoft", released: "2015",
        links: { website: "https://code.visualstudio.com" }
      },
      {
        name: "Claude Code",
        variant: "CLI + VS Code + JetBrains",
        status: "aktiv",
        reason: "Terminal-basierte AI-Entwicklung. CLAUDE.md fuer Projektkontexte. Skills fuer wiederverwendbare Patterns. MCP-Server-Integration.",
        techDesc: "Anthropic CLI-Tool fuer agentisches Coding. Liest CLAUDE.md als Projektkontext. Skills-System fuer domaeenspezifische Patterns. MCP-Server fuer Tool-Integration. Node.js-basiert. Erfordert npm install -g @anthropic-ai/claude-code.",
        noviceDesc: "Ein Programm, das im Terminal laeuft und Code schreiben, aendern und testen kann. Versteht den Projektkontext und arbeitet wie ein Entwickler-Assistent.",
        openSource: false, license: "Proprietaer", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Code wird an Anthropic API gesendet. Nur Spur-B-Code.",
        provider: "Anthropic", released: "2025",
        links: { docs: "https://docs.claude.com" }
      },
      {
        name: "Jupyter / JupyterLab",
        variant: "Notebooks",
        status: "aktiv",
        reason: "Interaktive Entwicklung fuer Datenanalyse, Embedding-Experimente und Pipeline-Prototyping. Standard im HPI-Kurs.",
        techDesc: "Webbasierte interaktive Entwicklungsumgebung. Notebooks fuer iterative Code-Ausfuehrung mit Visualisierung. Kernel fuer Python. nbconvert fuer Export. JupyterLab als IDE-artiges Interface.",
        noviceDesc: "Ein digitales Notizbuch, in dem man Code schreiben und sofort die Ergebnisse sehen kann. Ideal fuer Experimente und Datenanalyse.",
        openSource: true, license: "BSD", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal ausfuehrbar", provider: "Project Jupyter", released: "2014",
        links: { website: "https://jupyter.org" }
      }
    ]
  },
  {
    id: "knowledge",
    label: "Knowledge",
    description: "Wissensmanagement, Kollaboration und Datenorganisation",
    items: [
      {
        name: "Notion",
        variant: "Team / API / MCP",
        status: "aktiv",
        reason: "Zentrales Projektmanagement und Wissensmanagement. MCP-Integration fuer Claude-Zugriff. Spur-B-Ablage.",
        techDesc: "All-in-one Workspace fuer Wikis, Datenbanken, Projektmanagement. REST API + MCP-Server fuer Claude-Integration. Strukturierte Datenbanken mit Relations, Rollups, Formeln. Markdown-Export.",
        noviceDesc: "Eine flexible Arbeitsplattform, die Notizen, Datenbanken und Projektplaene kombiniert. Claude kann direkt darauf zugreifen.",
        openSource: false, license: "Proprietaer", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Cloud-basiert (AWS EU). Spur-B-Daten. Keine Spur-A-Inhalte.",
        provider: "Notion Labs Inc.", released: "2018",
        links: { website: "https://notion.so" }
      },
      {
        name: "Obsidian",
        variant: "Vault / Local-first",
        status: "aktiv",
        reason: "Lokales Wissensmanagement mit Markdown. Bidirektionale Links. Kandidat fuer RAG-Indexierung via HUB.",
        techDesc: "Local-first Markdown-Editor mit bidirektionalen Links, Graph View, Community Plugins. Daten als .md-Dateien im Dateisystem. Sync optional (E2E-verschluesselt). Canvas fuer visuelles Mapping.",
        noviceDesc: "Ein Notizbuch auf dem Computer, das Verbindungen zwischen Notizen herstellt. Alle Daten bleiben lokal als einfache Textdateien.",
        openSource: false, license: "Proprietaer (kostenlos)", country: "CA", countryFlag: "\u{1F1E8}\u{1F1E6}",
        gdprNote: "Local-first. Daten im Dateisystem. Sync E2E-verschluesselt.",
        provider: "Obsidian (Dynalist Inc.)", released: "2020",
        links: { website: "https://obsidian.md" }
      },
      {
        name: "SeaTable",
        variant: "Cloud / Self-hosted",
        status: "aktiv",
        reason: "Strukturierte Datenerfassung fuer Mandate und Evaluierungen. Spreadsheet-Datenbank mit API. DSGVO-konform (DE-Hosting).",
        techDesc: "No-Code Datenbank mit Spreadsheet-Interface. REST API fuer Automatisierung. Spaltentypen: Text, Zahl, Datum, Verknuepfung, Formel, Datei. Self-hosted Option (Docker). Python SDK. Webhooks fuer n8n-Integration.",
        noviceDesc: "Eine intelligente Tabelle, die mehr kann als Excel. Kann Dateien anhaengen, Bilder einbetten und mit anderen Programmen kommunizieren. Deutsches Hosting.",
        openSource: true, license: "Apache 2.0 (Community)", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "Deutsches Hosting (Hetzner). Self-hosted moeglich. DSGVO-konform.",
        provider: "SeaTable GmbH (Mainz)", released: "2020",
        links: { website: "https://seatable.io", github: "https://github.com/seatable/seatable" }
      },
      {
        name: "Proton Drive",
        variant: "E2E-verschluesselt",
        status: "aktiv",
        reason: "Spur-A-Ablage. E2E-Verschluesselung. Schweizer Jurisdiktion. Fuer alle personenbezogenen und mandatssensiblen Dokumente.",
        techDesc: "Zero-Knowledge-Verschluesselung. Dateisystem-Sync via Proton Drive Desktop. Schweizer Datenschutzrecht. Pfad: ~/Library/CloudStorage/ProtonDrive-aobser@pm.me-folder/SPUR-A_Proton-Drive_Verschluesselt/",
        noviceDesc: "Ein verschluesselter Cloud-Speicher in der Schweiz. Selbst der Anbieter kann die Dateien nicht lesen. Fuer alles Vertrauliche.",
        openSource: true, license: "GPL-3.0 (Client)", country: "CH", countryFlag: "\u{1F1E8}\u{1F1ED}",
        gdprNote: "Schweizer Jurisdiktion. E2E-verschluesselt. Zero-Knowledge.",
        provider: "Proton AG (Genf)", released: "2022",
        links: { website: "https://proton.me/drive" }
      },
      {
        name: "Google Drive",
        variant: "MCP-Integration",
        status: "aktiv",
        reason: "Spur-B-Dokumentenablage. MCP-Server fuer Claude-Zugriff. Google Docs fuer kollaborative Dokumente.",
        techDesc: "Cloud-Speicher mit MCP-Integration fuer Claude. Google Docs, Sheets, Slides. Sharing fuer externe Zusammenarbeit. API fuer Automatisierung.",
        noviceDesc: "Googles Cloud-Speicher mit direktem Claude-Zugriff. Fuer Dokumente, die nicht vertraulich sind.",
        openSource: false, license: "Proprietaer", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Google Cloud (EU-Speicherung moeglich). Nur Spur-B-Daten.",
        provider: "Google", released: "2012",
        links: { website: "https://drive.google.com" }
      }
    ]
  },
  {
    id: "automation",
    label: "Automation",
    description: "Workflow-Automatisierung und Systemintegration",
    items: [
      {
        name: "n8n",
        variant: "Self-hosted / Cloud",
        status: "aktiv",
        reason: "Workflow-Automatisierung fuer Knowledge-Currency-Pipelines, Release-Monitoring, Kalender-Hygiene.",
        techDesc: "Open-Source Workflow-Automatisierung. Node-basierte visuelle Programmierung. 400+ Integrationen. Webhook-Trigger, Cron-Scheduling. HTTP, API, Datenbank-Konnektoren. Self-hosted via Docker.",
        noviceDesc: "Ein Werkzeug, das Programme automatisch miteinander verbindet. Erledigt regelmaessig Aufgaben: Updates pruefen, Kalender aufraeumen, Daten synchronisieren.",
        openSource: true, license: "Sustainable Use License", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "In Deutschland entwickelt. Self-hosted moeglich.",
        provider: "n8n GmbH (Berlin)", released: "2019",
        links: { website: "https://n8n.io", github: "https://github.com/n8n-io/n8n" }
      },
      {
        name: "MCP (Model Context Protocol)",
        variant: "Anthropic Standard",
        status: "aktiv",
        reason: "Standardprotokoll fuer Tool-Integration in Claude. GCal, Gmail, Notion, Google Drive angebunden.",
        techDesc: "Offenes Protokoll von Anthropic fuer externe Datenquellen/Tools in LLM-Workflows. JSON-RPC ueber SSE. Server fuer GCal, Gmail, Notion, Google Drive u.a.",
        noviceDesc: "Eine Standardsprache, mit der Claude mit anderen Programmen kommuniziert. Kalender, E-Mail, Notion, alles ueber ein Protokoll.",
        openSource: true, license: "Open Standard", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Protokoll datenneutral. Datenschutz haengt vom MCP-Server ab.",
        provider: "Anthropic", released: "2024",
        links: { docs: "https://modelcontextprotocol.io" }
      },
      {
        name: "Google Calendar MCP",
        variant: "GCal Integration",
        status: "aktiv",
        reason: "Kalender-Steuerung durch alle 9 Agents. Event-CRUD, Free/Busy-Abfragen, Multi-Calendar-Routing.",
        techDesc: "MCP-Server fuer Google Calendar API. Unterstuetzt Event-Erstellung, -Aenderung, -Loeschung. Free-Time-Finder. Multi-Kalender mit Calendar-ID-Routing (Mandate, Pericore, Konferenzen, Reise, etc.).",
        noviceDesc: "Die Verbindung zwischen Claude und dem Google Kalender. Jeder Agent kann Termine lesen und erstellen.",
        openSource: true, license: "Open Standard", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Kalender-Daten = Spur B. Keine sensiblen Dokumente in Events.",
        provider: "Anthropic / Google", released: "2025",
        links: {}
      }
    ]
  },
  {
    id: "infra",
    label: "Infra",
    description: "Server, Deployment und Laufzeitumgebungen",
    items: [
      {
        name: "Apple MacBook Pro M5",
        variant: "Lokale Entwicklung",
        status: "aktiv",
        reason: "Primaere Entwicklungs- und Embedding-Maschine. MPS fuer GPU-beschleunigte Inference.",
        techDesc: "Apple Silicon M5, unified Memory Architecture. MPS Backend fuer PyTorch. Lokale Embedding-Berechnung (0.6B-4B). Thermisches Management fuer Dauerlast.",
        noviceDesc: "Der Laptop. Spezieller Chip fuer KI-Berechnungen. Kann Embedding-Modelle lokal ausfuehren.",
        openSource: false, license: "Hardware", country: "US", countryFlag: "\u{1F1FA}\u{1F1F8}",
        gdprNote: "Lokal. Keine Datenuebertragung.",
        provider: "Apple", released: "2025", links: {}
      },
      {
        name: "Hetzner Server",
        variant: "Dedicated / Cloud",
        status: "aktiv",
        reason: "Remote-Infrastruktur fuer rechenintensive Batch-Jobs, Qdrant-Hosting und n8n-Deployment. Deutsches Rechenzentrum.",
        techDesc: "Hetzner Dedicated/Cloud Server. Standort Nuernberg/Falkenstein. DSGVO-konform. SSH-Zugang via VS Code Remote. Docker-basiertes Deployment. Aktuell fuer SeaTable und n8n genutzt.",
        noviceDesc: "Ein gemieteter Computer in einem deutschen Rechenzentrum. Uebernimmt schwere Rechenarbeit und laeuft 24/7.",
        openSource: false, license: "Hosting", country: "DE", countryFlag: "\u{1F1E9}\u{1F1EA}",
        gdprNote: "Rechenzentrum Deutschland. DSGVO-konform. Spur-B.",
        provider: "Hetzner Online GmbH", released: "-",
        links: { website: "https://www.hetzner.com" }
      },
      {
        name: "Proton Mail / VPN",
        variant: "Business Suite",
        status: "aktiv",
        reason: "Verschluesselte Kommunikation. E2E-Verschluesselung fuer geschaeftliche E-Mails. VPN fuer sichere Verbindungen.",
        techDesc: "Zero-Knowledge-E-Mail mit E2E-Verschluesselung. PGP-kompatibel. Proton VPN fuer verschluesselte Verbindungen. Schweizer Jurisdiktion. Custom Domain Support.",
        noviceDesc: "Verschluesselte E-Mail und VPN aus der Schweiz. Niemand ausser Sender und Empfaenger kann die Nachrichten lesen.",
        openSource: true, license: "GPL-3.0 (Clients)", country: "CH", countryFlag: "\u{1F1E8}\u{1F1ED}",
        gdprNote: "Schweizer Jurisdiktion. E2E-verschluesselt.",
        provider: "Proton AG (Genf)", released: "2014",
        links: { website: "https://proton.me" }
      }
    ]
  }
];

const STATUS_CONFIG = {
  aktiv: { label: "AKTIV", color: "#22c55e", bg: "#052e16" },
  tentativ: { label: "TENTATIV", color: "#f59e0b", bg: "#2a1f00" },
  evaluiert: { label: "EVALUIERT", color: "#8b5cf6", bg: "#1e0a3e" },
  abgeloest: { label: "ABGELOEST", color: "#6b7280", bg: "#1a1a2e" },
  ausgeschlossen: { label: "AUSGESCHL.", color: "#ef4444", bg: "#2d0a0a" }
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 700,
      letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace",
      color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}33`
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: cfg.color, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function ComplianceBadges({ item }) {
  const isEU = ["DE", "CH", "AT", "NL", "FR"].includes(item.country);
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
      <span style={{ padding: "0px 5px", borderRadius: 2, fontSize: 8, fontWeight: 600, fontFamily: "monospace",
        color: item.openSource ? "#a3e635" : "#f87171",
        backgroundColor: item.openSource ? "#1a2e05" : "#2d0a0a",
        border: `1px solid ${item.openSource ? "#a3e63533" : "#f8717133"}`
      }}>
        {item.openSource ? `OSS ${item.license}` : "PROPRIETARY"}
      </span>
      <span style={{ padding: "0px 5px", borderRadius: 2, fontSize: 8, fontWeight: 600, fontFamily: "monospace",
        color: isEU ? "#60a5fa" : "#9ca3af",
        backgroundColor: isEU ? "#0a1a2d" : "#1a1a1a",
        border: `1px solid ${isEU ? "#60a5fa33" : "#9ca3af33"}`
      }}>
        {item.countryFlag} {item.country}
      </span>
      {isEU && (
        <span style={{ padding: "0px 5px", borderRadius: 2, fontSize: 8, fontWeight: 600, fontFamily: "monospace",
          color: "#3b82f6", backgroundColor: "#0a1a2d", border: "1px solid #3b82f633"
        }}>EU DSGVO</span>
      )}
    </div>
  );
}

function ItemCard({ item, isExpanded, onToggle }) {
  const [viewMode, setViewMode] = useState("tech");
  return (
    <div style={{
      backgroundColor: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 4,
      marginBottom: 4, overflow: "hidden",
      borderLeft: `3px solid ${STATUS_CONFIG[item.status]?.color || "#444"}`
    }}>
      <div onClick={onToggle} style={{
        padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        justifyContent: "space-between"
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
              {item.name}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#64748b" }}>{item.variant}</span>
            <StatusBadge status={item.status} />
          </div>
          <ComplianceBadges item={item} />
        </div>
        <span style={{ color: "#475569", fontSize: 12, transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none", flexShrink: 0 }}>
          &#9654;
        </span>
      </div>
      {isExpanded && (
        <div style={{ padding: "0 12px 12px", borderTop: "1px solid #1e1e3a" }}>
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6, lineHeight: 1.5 }}>
              <strong style={{ color: "#cbd5e1" }}>Einsatzgrund:</strong> {item.reason}
            </div>
            <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
              {["tech", "novice"].map(m => (
                <button key={m} onClick={(e) => { e.stopPropagation(); setViewMode(m); }}
                  style={{ padding: "2px 8px", borderRadius: 2, border: "1px solid #1e1e3a", cursor: "pointer",
                    fontSize: 9, fontWeight: 600, fontFamily: "monospace",
                    backgroundColor: viewMode === m ? (m === "tech" ? "#1e1e3a" : "#1a2744") : "transparent",
                    color: viewMode === m ? (m === "tech" ? "#e2e8f0" : "#60a5fa") : "#64748b"
                  }}>
                  {m === "tech" ? "TECHNISCH" : "EINFACH"}
                </button>
              ))}
            </div>
            <div style={{
              fontSize: 11, lineHeight: 1.5, padding: 8, borderRadius: 3,
              backgroundColor: viewMode === "tech" ? "#0a0a14" : "#0a1020",
              color: viewMode === "tech" ? "#94a3b8" : "#7dd3fc",
              border: `1px solid ${viewMode === "tech" ? "#1e1e3a" : "#1e3a5a"}`
            }}>
              {viewMode === "tech" ? item.techDesc : item.noviceDesc}
            </div>
            <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, color: "#475569" }}><strong>Anbieter:</strong> {item.provider}</span>
              {item.released !== "-" && <span style={{ fontSize: 9, color: "#475569" }}><strong>Release:</strong> {item.released}</span>}
              <span style={{ fontSize: 9, color: "#475569" }}><strong>DSGVO:</strong> {item.gdprNote}</span>
            </div>
            {Object.keys(item.links).length > 0 && (
              <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                {Object.entries(item.links).map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 9, color: "#3b82f6", textDecoration: "none", fontFamily: "monospace" }}>
                    [{k}]
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div style={{ padding: "8px 16px 0" }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Suche nach Tool, Anbieter, Stichwort..."
        style={{
          width: "100%", padding: "6px 10px", borderRadius: 3,
          border: "1px solid #1e1e3a", backgroundColor: "#0a0a14", color: "#e2e8f0",
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace", outline: "none",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState("embedding");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);

  const toggleItem = (id) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allItems = CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, categoryId: c.id, categoryLabel: c.label })));
  const counts = {};
  Object.keys(STATUS_CONFIG).forEach(s => { counts[s] = 0; });
  allItems.forEach(i => { if (counts[i.status] !== undefined) counts[i.status]++; });

  const isSearching = searchQuery.trim().length > 1;
  const q = searchQuery.toLowerCase();

  let displayItems;
  let displayCategoryLabel = null;

  if (isSearching) {
    displayItems = allItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.provider.toLowerCase().includes(q) ||
      i.reason.toLowerCase().includes(q) ||
      i.techDesc.toLowerCase().includes(q) ||
      i.variant.toLowerCase().includes(q) ||
      i.country.toLowerCase().includes(q)
    );
    if (filterStatus) displayItems = displayItems.filter(i => i.status === filterStatus);
  } else {
    const activeCat = CATEGORIES.find(c => c.id === activeCategory);
    displayItems = activeCat ? activeCat.items.map(i => ({ ...i, categoryId: activeCat.id, categoryLabel: activeCat.label })) : [];
    if (filterStatus) displayItems = displayItems.filter(i => i.status === filterStatus);
    displayCategoryLabel = activeCat?.description;
  }

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      backgroundColor: "#08081a", color: "#e2e8f0", minHeight: "100vh", padding: 0,
      maxWidth: 800, margin: "0 auto"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #1e1e3a" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", color: "#e2e8f0" }}>
            PERICORE TECHSTACK
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#475569" }}>v2.0 / 2026-04-07 / TEK</span>
        </div>
        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 10 }}>
          {allItems.length} Tools in {CATEGORIES.length} Kategorien. RAG, Embedding, LLM, Dev Tools, Knowledge, Automation, Infra.
        </div>

        {/* Status summary */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(counts).filter(([,c]) => c > 0).map(([status, count]) => (
            <button key={status} onClick={() => setFilterStatus(filterStatus === status ? null : status)}
              style={{
                display: "flex", alignItems: "center", gap: 3, padding: "2px 6px",
                borderRadius: 3, border: "1px solid transparent", cursor: "pointer",
                backgroundColor: filterStatus === status ? STATUS_CONFIG[status].bg : "transparent",
                borderColor: filterStatus === status ? `${STATUS_CONFIG[status].color}44` : "transparent",
                opacity: filterStatus && filterStatus !== status ? 0.35 : 1,
                transition: "all 0.15s"
              }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: STATUS_CONFIG[status].color }} />
              <span style={{ fontFamily: "monospace", fontSize: 9, color: STATUS_CONFIG[status].color, fontWeight: 600 }}>
                {count} {STATUS_CONFIG[status].label}
              </span>
            </button>
          ))}
          {filterStatus && (
            <button onClick={() => setFilterStatus(null)}
              style={{ fontSize: 9, color: "#64748b", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace" }}>
              ALLE
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setExpandedItems(new Set()); }} />

      {/* Category tabs */}
      {!isSearching && (
        <div style={{ display: "flex", borderBottom: "1px solid #1e1e3a", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setExpandedItems(new Set()); }}
              style={{
                padding: "8px 10px", border: "none", cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600,
                letterSpacing: "0.04em", whiteSpace: "nowrap",
                backgroundColor: activeCategory === cat.id ? "#0d0d1a" : "transparent",
                color: activeCategory === cat.id ? "#e2e8f0" : "#475569",
                borderBottom: activeCategory === cat.id ? "2px solid #3b82f6" : "2px solid transparent",
                transition: "all 0.15s"
              }}>
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: 12 }}>
        {isSearching && (
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>
            {displayItems.length} Treffer fuer "{searchQuery}"
          </div>
        )}
        {!isSearching && displayCategoryLabel && (
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>{displayCategoryLabel}</div>
        )}
        {displayItems.map(item => (
          <div key={`${item.categoryId}-${item.name}`}>
            {isSearching && (
              <div style={{ fontSize: 8, color: "#475569", fontFamily: "monospace", marginBottom: 2, marginTop: 4 }}>
                {item.categoryLabel}
              </div>
            )}
            <ItemCard item={item}
              isExpanded={expandedItems.has(item.name)}
              onToggle={() => toggleItem(item.name)}
            />
          </div>
        ))}
        {displayItems.length === 0 && (
          <div style={{ fontSize: 10, color: "#475569", textAlign: "center", padding: 20 }}>
            Keine Eintraege gefunden.
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid #1e1e3a", fontSize: 8, color: "#334155", fontFamily: "monospace", lineHeight: 1.5 }}>
        PERICORE TechStack Registry v2.0. Pflege: TEK (technisch) + HUB (strukturell).
        TECHNISCH = Standardbeschreibung / EINFACH = fuer AI-Novizen.
        Flaggen: Entwicklungs-/Hosting-Land. EU DSGVO = in EU/CH entwickelt oder self-hosted.
      </div>
    </div>
  );
}