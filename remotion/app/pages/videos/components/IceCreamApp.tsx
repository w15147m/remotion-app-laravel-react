import React, { useState, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import "../../../styles/ice-cream.css";
import { FaSignal, FaWifi, FaBatteryHalf, FaFutbol, FaChevronRight, FaCheck } from "react-icons/fa";

import { videoItems } from "../../../data/data";
import { z } from "zod";
import { GenericCardData } from "../../../remotion/schemata";

type CardData = z.infer<typeof GenericCardData>;

// --- Sub-Components ---

const StatusBar = ({ time }: { time: string }) => (
  <div id="status-bar" className="dark">
    <div className="f-right status-time">{time}</div>
    <div className="f-right"><FaBatteryHalf /></div>
    <div className="f-left"><FaSignal /></div>
    <div className="f-left"><FaWifi /></div>
  </div>
);

const countryToIso: Record<string, string> = {
  "Argentina": "ar",
  "Portugal": "pt",
  "Brazil": "br",
  "Hungary": "hu",
  "Austria": "at",
  "Northern Ireland": "gb-nir",
  "Germany": "de",
  "Poland": "pl",
  "Austria/Czechoslovakia": "at"
};

const ProducerScreen = ({ step, steps, setStep, setItem, onReview }: any) => {
  const currentItem = steps[step].items[steps[step].item];
  const countryCode = currentItem?.country ? (countryToIso[currentItem.country] || "un") : "un";

  return (
    <div id="producer-screen">
      <div className="nav-bar">
        <button className="back-button">
          <img
            src={`https://flagcdn.com/w80/${countryCode}.png`}
            alt={currentItem?.country || "Flag"}
            style={{ width: 35, height: 'auto', borderRadius: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          />
        </button>
        <button className="app-icon" onClick={onReview}><FaFutbol style={{ color: '#5ea0f7' }} /></button>
      </div>
      <div className="steps-wrapper">
        <p className="step-counter">GOALS</p>

        {/* Carousel Title - Synchronized with items */}
        <div className="carousel-wrapper">
          <div className="carousel-title">
            {steps[step].items?.map((item: any, idx: number) => (
              <p
                key={idx}
                className={idx === steps[step].item ? 'active' : idx < steps[step].item ? 'before' : 'after'}
              >
                {item.title}
              </p>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="step-content-wrapper">
          <div className="indicator" />
          {steps.map((v: any, i: number) => (
            <div
              key={i}
              className={`step-content ${i === step ? 'active' : i < step ? 'before' : 'after'}`}
            >
              {!v.review ? (
                <>
                  {v.items.map((_v: any, _i: number) => (
                    <div
                      key={_i}
                      onClick={() => setItem(i, _i)}
                      className={`step-content-item ${_i === v.item ? 'active' :
                        _i + 1 === v.item ? 'before' :
                          _i - 1 === v.item ? 'after' :
                            _i < v.item ? 'before-all' : 'after-all'
                        }`}
                    >
                      <div
                        className="step-content-item-image"
                        style={{ backgroundImage: `url(${_v.image})` }}
                      />
                      <p style={{ marginTop: 10 }}>{_v.playerTitle}</p>
                    </div>
                  ))}
                  <div className="step-content-footer">
                    <div className="bullet-wrapper">
                      {v.items.map((_v: any, _i: number) => (
                        <div key={_i} className={`bullet ${_i === v.item ? 'active' : ''}`} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {steps.map((s: any, idx: number) => {
                    if (!s.review) {
                      return (
                        <div key={idx} className="review-item" onClick={() => setStep(idx)}>
                          <div
                            className="review-item-image"
                            style={{ backgroundImage: `url(${s.items[s.item].image})` }}
                          />
                          <p>{s.items[s.item].title}</p>
                          <FaChevronRight />
                        </div>
                      );
                    }
                    return null;
                  })}
                  <button onClick={onReview} className="btn btn-primary" style={{ marginTop: 20 }}>
                    <FaCheck /> Confirm
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FinalScreen = ({ steps }: any) => (
  <div id="final-screen">
    <div className="final-screen-message">
      <h1>Congratulation</h1>
      <p>Your ice cream has been created successfully</p>
    </div>
    <div className="manufactured-icecream">
      <div
        className="selected-sprinkle"
        style={{ backgroundImage: `url(${steps[2].items[steps[2].item].image})` }}
      />
      <div
        className="selected-flavor"
        style={{ backgroundImage: `url(${steps[1].items[steps[1].item].image})` }}
      />
      <div
        className="selected-cone"
        style={{ backgroundImage: `url(${steps[0].items[steps[0].item].image})` }}
      />
    </div>
  </div>
);

// --- Main App Component ---

interface IceCreamAppProps {
  cardsData?: CardData[];
}

export const IceCreamApp: React.FC<IceCreamAppProps> = ({ cardsData = [] }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Transform cardsData to database-driven items
  const databaseSteps = [
    {
      title: 'Goals',
      item: 2,
      items: (cardsData.length > 0 ? cardsData : videoItems).slice(0, 10).map(item => ({
        id: item.rankNumber?.toString() || Math.random().toString(),
        image: item.mediaUrl,
        title: `${item.rankNumber}`,
        country: item.country,
        playerTitle: item.title
      }))
    }
  ];

  // Calculate scale to fit the screen
  const baseHeight = 700;
  const scale = (height / baseHeight) * 0.95;

  // Simulation State
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<'welcome' | 'producer' | 'final'>('welcome');
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState(databaseSteps);

  // Auto-Play Logic - Single step, forward animation only
  useEffect(() => {
    setLoading(false);
    setScreen('producer');
    setStep(0); // Always stay on step 0 (Choose Cone)

    // Smoothly cycle through items 0 → 1 → 2 → 3 → 0...
    const secondsPerItem = 2;
    const totalItems = steps[0].items.length;
    const targetItem = Math.floor(frame / (fps * secondsPerItem)) % totalItems;

    // Only update if moving forward to prevent backward animation
    setSteps(prev => {
      const newSteps = [...prev];
      if (targetItem !== newSteps[0].item) {
        newSteps[0].item = targetItem;
      }
      return newSteps;
    });
  }, [frame, fps, steps]);

  const handleSetItem = (stepIndex: number, itemIndex: number) => {
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[stepIndex].item = itemIndex;
      return newSteps;
    });
  };

  const handleConfirm = () => {
    setScreen('final');
  };

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: '#eceff8' }} className="ice-cream-app-container">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: 320,
          height: 650,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div id="mobile">
          <div id="mobile-container">
            <StatusBar time="12:00" />

            <div id="page-container">
              <div className={`page-container-transformer`}>
                {screen === 'producer' && (
                  <ProducerScreen
                    step={step}
                    steps={steps}
                    setStep={setStep}
                    setItem={handleSetItem}
                    onReview={handleConfirm}
                  />
                )}
              </div>
            </div>

            <div id="action-bar">
              <button className="f-left"></button>
              <button className="f-right"></button>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
