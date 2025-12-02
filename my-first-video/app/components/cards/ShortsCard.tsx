import React from 'react';
import { Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { GenericCardData } from '../../remotion/schemata';
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont();

export interface ShortsCardProps {
  data: z.infer<typeof GenericCardData>;
  index: number;
}

// DESIGN 5: MODERN DARK WITH COLOR ACCENT
// export const ShortsCard: React.FC<ShortsCardProps> = ({ data, index }) => {
//   const frame = useCurrentFrame();
//   const { fps } = useVideoConfig();

//   const delay = index * 3;
//   const scale = spring({
//     frame: frame - delay,
//     fps,
//     config: {
//       damping: 100,
//       stiffness: 200,
//       mass: 0.5,
//     },
//   });

//   const opacity = spring({
//     frame: frame - delay,
//     fps,
//     config: {
//       damping: 100,
//     },
//   });

//   const pulse = Math.sin(frame / 15) * 0.05 + 1;

//   return (
//     <div style={{
//       width: '100%',
//       height: '100%',
//       backgroundColor: '#0f0f0f',
//       display: 'flex',
//       flexDirection: 'column',
//       position: 'relative',
//       overflow: 'hidden',
//       transform: `scale(${scale})`,
//       opacity,
//     }}>
//       {/* Colored top bar */}
//       <div style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         height: '6px',
//         background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
//       }} />

//       {/* Image Section */}
//       <div style={{
//         position: 'relative',
//         height: '50%',
//         overflow: 'hidden',
//       }}>
//         {data.icon && (
//           <div style={{
//             position: 'absolute',
//             top: '20px',
//             left: '20px',
//             fontSize: '55px',
//             zIndex: 2,
//             backgroundColor: 'rgba(15,15,15,0.9)',
//             borderRadius: '16px',
//             padding: '12px 16px',
//             border: '2px solid rgba(102, 126, 234, 0.5)',
//             transform: `scale(${pulse})`,
//           }}>
//             {data.icon}
//           </div>
//         )}

//         {data.mediaUrl ? (
//           <Img
//             src={data.mediaUrl}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               filter: 'grayscale(100%) contrast(1.1)',
//             }}
//           />
//         ) : (
//           <div style={{
//             width: '100%',
//             height: '100%',
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             filter: 'grayscale(100%)',
//           }} />
//         )}

//         {data.yearRange && (
//           <div style={{
//             position: 'absolute',
//             bottom: '20px',
//             right: '20px',
//             backgroundColor: '#667eea',
//             color: '#fff',
//             padding: '10px 20px',
//             borderRadius: '8px',
//             fontFamily,
//             fontSize: '20px',
//             fontWeight: '800',
//             letterSpacing: '1px',
//             boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
//           }}>
//             {data.yearRange}
//           </div>
//         )}
//       </div>

//       {/* Info Section */}
//       <div style={{
//         flex: 1,
//         padding: '40px 30px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//       }}>
//         <div>
//           <div style={{
//             fontFamily,
//             fontSize: '48px',
//             fontWeight: '900',
//             color: '#fff',
//             marginBottom: '12px',
//             lineHeight: '1.1',
//           }}>
//             {data.title}
//           </div>

//           {data.subtitle && (
//             <div style={{
//               fontFamily,
//               fontSize: '24px',
//               color: '#999',
//               marginBottom: '16px',
//               fontWeight: '600',
//             }}>
//               {data.subtitle}
//             </div>
//           )}

//           {data.label && (
//             <div style={{
//               display: 'inline-block',
//               backgroundColor: 'transparent',
//               color: '#667eea',
//               padding: '8px 0',
//               fontFamily,
//               fontSize: '18px',
//               fontWeight: '700',
//               borderBottom: '3px solid #667eea',
//               letterSpacing: '1px',
//             }}>
//               {data.label}
//             </div>
//           )}
//         </div>

//         {data.highlightValue && (
//           <div style={{
//             fontFamily,
//             fontSize: '90px',
//             fontWeight: '900',
//             color: '#667eea',
//             letterSpacing: '4px',
//             lineHeight: '1',
//             transform: `scale(${pulse})`,
//           }}>
//             {data.highlightValue}
//           </div>
//         )}

//         {data.rankNumber !== undefined && data.rankLabel && (
//           <div style={{
//             fontFamily,
//             fontSize: '68px',
//             fontWeight: '900',
//             color: '#667eea',
//             letterSpacing: '3px',
//           }}>
//             #{data.rankNumber} {data.rankLabel}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// DESIGN 6: GRADIENT OVERLAY STYLE
// export const ShortsCard: React.FC<ShortsCardProps> = ({ data, index }) => {
//   const frame = useCurrentFrame();
//   const { fps } = useVideoConfig();

//   const delay = index * 3;
//   const scale = spring({
//     frame: frame - delay,
//     fps,
//     config: {
//       damping: 100,
//       stiffness: 200,
//       mass: 0.5,
//     },
//   });

//   const opacity = spring({
//     frame: frame - delay,
//     fps,
//     config: {
//       damping: 100,
//     },
//   });

//   const pulse = Math.sin(frame / 15) * 0.05 + 1;

//   return (
//     <div style={{
//       width: '100%',
//       height: '100%',
//       backgroundColor: '#000',
//       display: 'flex',
//       flexDirection: 'column',
//       position: 'relative',
//       overflow: 'hidden',
//       transform: `scale(${scale})`,
//       opacity,
//     }}>
//       {/* Image Section with Overlay */}
//       <div style={{
//         position: 'relative',
//         height: '55%',
//         overflow: 'hidden',
//       }}>
//         {data.mediaUrl ? (
//           <Img
//             src={data.mediaUrl}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               filter: 'grayscale(100%) brightness(0.8)',
//             }}
//           />
//         ) : (
//           <div style={{
//             width: '100%',
//             height: '100%',
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             filter: 'grayscale(100%)',
//           }} />
//         )}

//         {/* Gradient overlay */}
//         <div style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: '60%',
//           background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
//         }} />

//         {data.icon && (
//           <div style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             fontSize: '60px',
//             zIndex: 2,
//             filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
//             transform: `scale(${pulse})`,
//           }}>
//             {data.icon}
//           </div>
//         )}

//         {data.yearRange && (
//           <div style={{
//             position: 'absolute',
//             top: '20px',
//             left: '20px',
//             backgroundColor: 'rgba(255,255,255,0.95)',
//             color: '#000',
//             padding: '8px 18px',
//             borderRadius: '20px',
//             fontFamily,
//             fontSize: '18px',
//             fontWeight: '800',
//             letterSpacing: '1px',
//           }}>
//             {data.yearRange}
//           </div>
//         )}

//         {/* Title at bottom of image */}
//         <div style={{
//           position: 'absolute',
//           bottom: '20px',
//           left: '30px',
//           right: '30px',
//           zIndex: 2,
//         }}>
//           <div style={{
//             fontFamily,
//             fontSize: '52px',
//             fontWeight: '900',
//             color: '#fff',
//             lineHeight: '1.1',
//             textShadow: '0 4px 20px rgba(0,0,0,0.8)',
//           }}>
//             {data.title}
//           </div>
//         </div>
//       </div>

//       {/* Info Section */}
//       <div style={{
//         flex: 1,
//         padding: '30px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         backgroundColor: '#000',
//       }}>
//         <div>
//           {data.subtitle && (
//             <div style={{
//               fontFamily,
//               fontSize: '26px',
//               color: '#888',
//               marginBottom: '12px',
//               fontWeight: '600',
//             }}>
//               {data.subtitle}
//             </div>
//           )}

//           {data.label && (
//             <div style={{
//               display: 'inline-block',
//               backgroundColor: '#222',
//               color: '#fff',
//               padding: '8px 16px',
//               borderRadius: '6px',
//               fontFamily,
//               fontSize: '16px',
//               fontWeight: '700',
//             }}>
//               {data.label}
//             </div>
//           )}
//         </div>

//         {data.highlightValue && (
//           <div style={{
//             fontFamily,
//             fontSize: '85px',
//             fontWeight: '900',
//             color: '#fff',
//             letterSpacing: '4px',
//             lineHeight: '1',
//             transform: `scale(${pulse})`,
//           }}>
//             {data.highlightValue}
//           </div>
//         )}

//         {data.rankNumber !== undefined && data.rankLabel && (
//           <div style={{
//             fontFamily,
//             fontSize: '64px',
//             fontWeight: '900',
//             color: '#fff',
//             letterSpacing: '3px',
//           }}>
//             #{data.rankNumber} {data.rankLabel}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// DESIGN 7: SPLIT SCREEN MODERN
// export const ShortsCard: React.FC<ShortsCardProps> = ({ data, index }) => {
//   const frame = useCurrentFrame();
//   const { fps } = useVideoConfig();

//   const delay = index * 3;
//   const scale = spring({
//     frame: frame - delay,
//     fps,
//     config: {
//       damping: 100,
//       stiffness: 200,
//       mass: 0.5,
//     },
//   });

//   const opacity = spring({
//     frame: frame - delay,
//     fps,
//     config: {
//       damping: 100,
//     },
//   });

//   const pulse = Math.sin(frame / 15) * 0.05 + 1;

//   return (
//     <div style={{
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'row',
//       transform: `scale(${scale})`,
//       opacity,
//     }}>
//       {/* Left side - Image */}
//       <div style={{
//         width: '45%',
//         position: 'relative',
//         overflow: 'hidden',
//       }}>
//         {data.mediaUrl ? (
//           <Img
//             src={data.mediaUrl}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               filter: 'grayscale(100%) contrast(1.1)',
//             }}
//           />
//         ) : (
//           <div style={{
//             width: '100%',
//             height: '100%',
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             filter: 'grayscale(100%)',
//           }} />
//         )}

//         {data.icon && (
//           <div style={{
//             position: 'absolute',
//             top: '20px',
//             left: '20px',
//             fontSize: '55px',
//             backgroundColor: 'rgba(255,255,255,0.95)',
//             borderRadius: '50%',
//             width: '90px',
//             height: '90px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
//             transform: `scale(${pulse})`,
//           }}>
//             {data.icon}
//           </div>
//         )}

//         {data.yearRange && (
//           <div style={{
//             position: 'absolute',
//             bottom: '20px',
//             left: '20px',
//             backgroundColor: 'rgba(0,0,0,0.9)',
//             color: '#fff',
//             padding: '12px 20px',
//             borderRadius: '8px',
//             fontFamily,
//             fontSize: '20px',
//             fontWeight: '800',
//             letterSpacing: '1px',
//           }}>
//             {data.yearRange}
//           </div>
//         )}
//       </div>

//       {/* Right side - Info */}
//       <div style={{
//         width: '55%',
//         backgroundColor: '#1a1a1a',
//         padding: '50px 40px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//       }}>
//         <div>
//           <div style={{
//             fontFamily,
//             fontSize: '46px',
//             fontWeight: '900',
//             color: '#fff',
//             marginBottom: '15px',
//             lineHeight: '1.1',
//           }}>
//             {data.title}
//           </div>

//           {data.subtitle && (
//             <div style={{
//               fontFamily,
//               fontSize: '24px',
//               color: '#999',
//               marginBottom: '20px',
//               fontWeight: '600',
//             }}>
//               {data.subtitle}
//             </div>
//           )}

//           {data.label && (
//             <div style={{
//               display: 'inline-block',
//               backgroundColor: '#2a2a2a',
//               color: '#fff',
//               padding: '10px 20px',
//               borderRadius: '8px',
//               fontFamily,
//               fontSize: '18px',
//               fontWeight: '700',
//               border: '2px solid #3a3a3a',
//             }}>
//               {data.label}
//             </div>
//           )}
//         </div>

//         {data.highlightValue && (
//           <div style={{
//             fontFamily,
//             fontSize: '95px',
//             fontWeight: '900',
//             color: '#667eea',
//             letterSpacing: '4px',
//             lineHeight: '1',
//             transform: `scale(${pulse})`,
//           }}>
//             {data.highlightValue}
//           </div>
//         )}

//         {data.rankNumber !== undefined && data.rankLabel && (
//           <div style={{
//             fontFamily,
//             fontSize: '70px',
//             fontWeight: '900',
//             color: '#667eea',
//             letterSpacing: '3px',
//           }}>
//             #{data.rankNumber} {data.rankLabel}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// DESIGN 8: ELEGANT SERIF STYLE
export const ShortsCard: React.FC<ShortsCardProps> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 3;
  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
    },
  });

  const pulse = Math.sin(frame / 15) * 0.05 + 1;

  return (
    <div style={{
      width: '100%',
      height: '1751px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      transform: `scale(${scale})`,
      opacity,
      border: '1px solid #16213e',
    }}>
      {/* Image Section */}
      <div style={{
        position: 'relative',
        height: '52%',
        overflow: 'hidden',
        borderBottom: '1px solid #0f3460',
      }}>
        {data.icon && (
          <div style={{
            position: 'absolute',
            top: '25px',
            left: '25px',
            fontSize: '50px',
            zIndex: 2,
            backgroundColor: 'rgba(230,57,70,0.95)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 2px 10px rgba(230,57,70,0.3)',
            border: '1px solid rgba(230,57,70,0.5)',
            transform: `scale(${pulse})`,
          }}>
            {data.icon}
          </div>
        )}

        {data.mediaUrl ? (
          <Img
            src={data.mediaUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%)',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            filter: 'grayscale(100%)',
          }} />
        )}

        {data.yearRange && (
          <div style={{
            position: 'absolute',
            bottom: '25px',
            left: '25px',
            backgroundColor: '#e63946',
            color: '#f1faee',
            padding: '8px 18px',
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '2px',
          }}>
            {data.yearRange}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div style={{
        flex: 1,
        padding: '40px 35px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a2e',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '100px',
            textAlign: 'center',
            background: '#0f3460',
            fontWeight: '700',
            color: '#f1faee',
            marginBottom: '12px',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
          }}>
            {data.title}
          </div>

          {data.subtitle && (
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '100px',
              textAlign: 'center',
              background: '#0f3460',
              color: '#a8dadc',
              marginBottom: '18px',
              fontWeight: '400',
              fontStyle: 'italic',
            }}>
              {data.yearRange}
            </div>
          )}

          {data.rankNumber && data.rankLabel && (
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '100px',
              textAlign: 'center',
              background: '#0f3460',
              fontWeight: '700',
              color: '#f1faee',
              marginBottom: '12px',
              lineHeight: '1.2',
              textTransform: 'uppercase',
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {data.rankNumber}
              <br />
              {data.rankLabel}
            </div>
          )}
        </div>


      </div>
    </div >
  );
};