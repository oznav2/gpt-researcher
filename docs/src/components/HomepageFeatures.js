import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'עמית מחקר',
    Svg: require('../../static/img/logo.png').default,
    docLink: './docs/gpt-researcher/getting-started/getting-started',
    description: (
      <>
        עמית המחקר הוא עמית אוטונומי בקוד פתוח המשוייך למחקר משולב ודיווח מפורט של תהליכיו בפעולה.
      </>
    ),
  },
  /*{
    title: 'Tavily Search API',
    Svg: require('../../static/img/tavily.png').default,
    docLink: './docs/tavily-api/introduction',
    description: (
      <>
        Tavily Search API is a search engine optimized for LLMs, optimized for a factual, efficient, and persistent search experience
      </>
    ),
  },*/
  {
    title: 'מחקר צוות מומחים',
    Svg: require('../../static/img/multi-agent.png').default,
    docLink: './docs/gpt-researcher/multi_agents/langgraph',
    description: (
      <>
        צפה כיצד צוות של מומחים מבוססי בינה מלאכותית יכולים לעבוד יחד כדי לבצע מחקר על נושא נתון, מתוך תוכנית ועד הוצאת תוצאות.
      </>
    ),
  },
  {
    title: 'דוגמאות והדגמה',
    Svg: require('../../static/img/examples.png').default,
    docLink: './docs/examples/examples',
    description: (
      <>
        צפה בפעולת עמית המחקר בפעולה במגוון שימושים ומצבים כולל מחקר משולב ודיווח מפורט בפעולה.
      </>
    ),
  },
];

function Feature({Svg, title, description, docLink}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/*<Svg className={styles.featureSvg} alt={title} />*/}
        <img src={Svg} alt={title} height="60"/>
      </div>
      <div className="text--center padding-horiz--md">
        <Link to={docLink}>
            <h3>{title}</h3>
        </Link>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container" style={{marginTop: 30}}>
        <div className="row" style={{justifyContent: 'center'}}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
