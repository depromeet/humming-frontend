import React, { useEffect, useCallback } from "react";
import anime from "animejs";
import "./style.css";

export const AnimateLogo = React.memo(() => {
  const drawing = useCallback(() => {
    anime({
      targets: ".path",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 1200,
      delay: function (el, i) {
        return i * 250;
      },
    });
  }, []);

  useEffect(() => {
    drawing();
  }, [drawing]);

  return (
    <div className="logo-wrapper">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100%"
        height="auto"
        viewBox="0 0 287.8 88.3"
      >
        {/* H */}
        <path
          className="path"
          d="M52.6,48.7c-7.4,7.7-18.2,7-19.9-16.1C30.9,9.5,37.6,1.7,41.8,2.5c7.1,1.3,9,14.9-18.6,31.1S7.8,58,13.9,55.1 s6.1-14.7,0.3-33s6.4-20.5,6.4-20.5c4.4-0.8,8.5,6.1-1,11S2,21.7,1.5,28.6"
        />
        {/* u */}
        <path
          className="path"
          d="M56.6,37.9c0,0,3.7-1.4,7.6-5.5c0,0-6.9,21.3,1.5,21.3c10.9,0,15.3-14,16.5-21.8c0,0-2.8,17.8-0.2,20.7 c3.1,3.5,6.6-1.8,6.6-1.8"
        />
        {/* 첫번째 m */}
        <path
          className="path"
          d="M136.9,53.9c-5.4-3.3,3.5-16.7-4.7-20.6c-8.6-4.2-17.6,5.4-17.1,11.4c0.4,5.4,5.4,4.6,7.2,2.4 c2.6-3.1,2.2-15-6.2-15c-10.9,0-15.3,14-16.5,21.8c0,0,2.8-17.8,0.2-20.7c-3.1-3.5-6.6,1.8-6.6,1.8"
        />
        {/* 두번째 m */}
        <path
          className="path"
          d="M188.7,53.9c-5.4-3.3,3.5-16.7-4.7-20.6c-8.6-4.2-17.6,5.4-17.1,11.4c0.4,5.4,5.4,4.6,7.2,2.4 c2.6-3.1,2.2-15-6.2-15c-10.9,0-15.3,14-16.5,21.8c0,0,2.8-17.8,0.2-20.7c-3.1-3.5-6.6,1.8-6.6,1.8"
        />
        {/* i의 아래 몸통 */}
        <path
          className="path"
          d="M198.1,43.4c0,0,6.7-5.6,10.4-11.1c0,0-10,23.4-5.7,22.7s7.6-5.5,7.6-5.5"
        />
        {/* i의 위 동그라미 */}
        <path
          className="path"
          d="M211.7,25.2c0,0,0.8-13.4,6.2-10.7S211.7,25.2,211.7,25.2z"
        />
        {/* n */}
        <path
          className="path"
          d="M254.4,47.6c0,0-3.7,1.4-7.6,5.5c0,0,6.8-21.3-3.6-21.2c-10.9,0.2-16.5,14-17.7,21.8c0,0,4-17.8,1.4-20.7 c-3.1-3.5-6.6,1.8-6.6,1.8"
        />
        {/* g */}
        <path
          className="path"
          d="M270,44.6c0,0,1.4,5,7,4.8c5.6-0.1,8.9-6.9,9.2-13.2c0.6-11.6-14.6-17-19.8-5.4c-4.9,11.1,4,48.1-10.4,54.3 c-21.6,9.4-25.8-25.7-0.7-18.7c16.8,4.7,29.5-6.3,29.5-6.3"
        />
      </svg>
    </div>
  );
});
