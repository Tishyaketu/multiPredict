import { Link } from 'react-router-dom';

function DiseaseCard({ config }) {
    // Config has: name, slug, icon (url)
    return (
        <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {/* Placeholder for icon if url is not valid generic image */}
                🏥
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{config.name}</h3>
            <Link
                to={`/analysis/${config.slug}`}
                className="btn btn-primary"
                style={{ marginTop: '1rem', display: 'inline-block' }}
            >
                Start Analysis
            </Link>
        </div>
    );
}

export default DiseaseCard;
