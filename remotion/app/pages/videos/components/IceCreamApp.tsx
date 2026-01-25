import React, { useState, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import "../../../styles/ice-cream.css";
import { FaSignal, FaWifi, FaBatteryHalf, FaArrowLeft, FaIceCream, FaCheck, FaChevronLeft, FaChevronRight, FaHeart, FaHome, FaCode } from "react-icons/fa";

// --- Mock Data ---
const stepsData = [
  {
    title: 'Choose Cone',
    item: 0,
    items: [
      { id: '1', image: 'https://i.ibb.co/2h275Q8/waffle-cone.png', title: 'Waffle cone' },
      { id: '2', image: 'https://i.ibb.co/pnK7Hqz/chocolate-cone.png', title: 'Chocolate cone' },
      { id: '3', image: 'https://i.ibb.co/R99bX8c/strawberry-cone.png', title: 'Strawberry cone' },
      { id: '4', image: 'https://i.ibb.co/nPnJjyN/sofran-cone.png', title: 'Sofran cone' }
    ]
  },
  {
    title: 'Choose Flavor',
    item: 0,
    items: [
      { id: '1', image: 'https://i.ibb.co/fMN3HST/melon-flavor.png', title: 'Melon Flavor' },
      { id: '2', image: 'https://i.ibb.co/8XgX4rg//banana-flavor.png', title: 'Banana Flavor' },
      { id: '3', image: 'https://i.ibb.co/MVZRS6w/strawberry-flavor.png', title: 'Strawberry Flavor' },
      { id: '4', image: 'https://i.ibb.co/LNjQGKy/blueberry-flavor.png', title: 'Blueberry Flavor' }
    ]
  },
  {
    title: 'Choose sprinkles',
    item: 0,
    items: [
      { id: '1', image: 'https://i.ibb.co/t2mfKZ4/rainbow-sprinkle.png', title: 'Rainbow Sprinkle' },
      { id: '2', image: 'https://i.ibb.co/C01bsVb/red-sprinkle.png', title: 'Red Sprinkle' }
    ]
  },
  {
    title: 'Review',
    review: true
  }
];

// --- Sub-Components ---

const StatusBar = ({ time }: { time: string }) => (
  <div id="status-bar" className="dark">
    <div className="f-right status-time">{time}</div>
    <div className="f-right"><FaBatteryHalf /></div>
    <div className="f-left"><FaSignal /></div>
    <div className="f-left"><FaWifi /></div>
  </div>
);

const SplashScreen = ({ dead }: { dead: boolean }) => (
  <div id="splash-screen" className={dead ? 'dead' : ''}>
    <div className="splash-icon-wrapper">
      <FaIceCream style={{ fontSize: 70, marginBottom: 10 }} />
      <p>Ice cream app is loading</p>
    </div>
    <div className="loader-wrapper">
      <div className="load">
        <div className="load-animation" />
      </div>
    </div>
  </div>
);

const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <div id="welcome-screen">
    <FaIceCream style={{ fontSize: 40, color: '#5ea0f7' }} />
    <h1>Welcome</h1>
    <p className="description">
      Customize your own ice cream creation, and your ice cream maker
      will automatically create it!
    </p>
    <div>
      <img
        className="welcome-screen-image"
        src="https://i.ibb.co/c6HjsM7/mainice.png"
        alt="Main Ice Cream"
      />
    </div>
    <div style={{ marginTop: 20 }}>
      <button onClick={onStart} className="btn btn-primary">
        Tap to begin...
      </button>
    </div>
  </div>
);

const ProducerScreen = ({ step, steps, setStep, setItem, onReview }: any) => {
  return (
    <div id="producer-screen">
      <div className="nav-bar">
        <button className="back-button"><FaArrowLeft /></button>
        <button className="app-icon" onClick={onReview}><FaIceCream /></button>
      </div>
      <div className="steps-wrapper">
        <p className="step-counter">STEP {step + 1}</p>

        {/* Carousel Title/Nav */}
        <div className="carousel-wrapper">
          <button disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
            <FaChevronLeft />
          </button>
          <div className="carousel-title">
            {steps.map((v: any, i: number) => (
              <p
                key={i}
                className={i === step ? 'active' : i < step ? 'before' : 'after'}
              >
                {v.title}
              </p>
            ))}
          </div>
          <button disabled={step === steps.length - 1} onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
            <FaChevronRight />
          </button>
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
                      <p>{_v.title}</p>
                    </div>
                  ))}
                  <div className="step-content-footer">
                    <div className="selected">
                      <FaCheck /> <span>Selected</span>
                    </div>
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

export const IceCreamApp = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // Get composition dimensions

  // Calculate scale to fit the screen with some padding
  // Base design is roughly 350x700 including margins
  const baseHeight = 700;
  const scale = (height / baseHeight) * 0.95; // Scale to 95% of screen height

  // ... (rest of logic)

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: '#eceff8' }} className="ice-cream-app-container">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: 320, // Enforce base width so centering works
          height: 650, // Enforce base height
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div id="mobile">
          <div id="mobile-container">
            <StatusBar time="12:00" />

            {loading ? (
              <SplashScreen dead={frame > fps * 1.2} />
            ) : (
              <div id="page-container">
                <div className={`page-container-transformer`}>
                  {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('producer')} />}
                  {screen === 'producer' && (
                    <ProducerScreen
                      step={step}
                      steps={steps}
                      setStep={setStep}
                      setItem={handleSetItem}
                      onReview={handleConfirm}
                    />
                  )}
                  {screen === 'final' && <FinalScreen steps={steps} />}
                </div>
              </div>
            )}

            <div id="action-bar">
              <button className="f-left"><FaHeart /></button>
              <button className="home-botton" onClick={() => setScreen('welcome')}>
                <FaHome />
              </button>
              <button className="f-right"><FaCode /></button>
            </div>
          </div>
        </div>
    </AbsoluteFill>
  );
};
