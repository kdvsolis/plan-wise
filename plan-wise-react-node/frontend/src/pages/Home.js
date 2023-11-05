import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  useEffect(() => {
    document.title = "Plan Wise - Home";
  }, []);

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <section className="uui-section_cta05">
        <div className="uui-page-padding-3">
          <div className="uui-container-large-3">
            <div className="uui-padding-vertical-xhuge-3">
              <div className="uui-cta05_component">
                <div className="uui-cta05_content">
                  <div className="uui-max-width-large-3">
                    <h3 className="uui-heading-small">Setup your Budget</h3>
                    <div className="uui-space-xsmall-3"></div>
                    <div className="uui-text-size-large-3">Add your expenses and income</div>
                  </div>
                </div>
                <div className="uui-button-row-2 is-reverse-mobile-landscape">
                  <div className="uui-button-wrapper-2 max-width-full-mobile-landscape">
                    <Link to="/expenses" className="uui-button-secondary-gray-3 w-inline-block">
                      <div>Expenses</div>
                    </Link>
                  </div>
                  <div className="uui-button-wrapper-2 max-width-full-mobile-landscape">
                    <Link to="/income" className="uui-button-secondary-gray-3 w-inline-block">
                      <div>Income</div>
                    </Link>
                  </div>
                  <div className="uui-button-wrapper-2 max-width-full-mobile-landscape">
                    <Link to="/budget-table" className="uui-button-3 w-inline-block">
                      <div>Budget Table</div>
                    </Link>
                  </div>
                  <div className="uui-button-wrapper-2 max-width-full-mobile-landscape">
                    <Link to="/budget-calendar" className="uui-button-3 w-inline-block">
                      <div>Budget Calendar</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
