import React, { useEffect, useState, useCallback, useMemo } from 'react';
import * as ethers from 'ethers'
import moment from 'moment'
import { RiLoader5Fill } from 'react-icons/ri'
import cx from "classnames";

import {
  yaxisFormatterNumber,
  tooltipLabelFormatterUnits,
  tooltipFormatterNumber,
  formatNumber,
  COLORS
} from '../helpers'

import GenericChart from '../components/GenericChart'

import {
  useReferralsData,
  useLastSubgraphBlock,
  useLastBlock
} from '../dataProvider'

const NOW = Math.floor(Date.now() / 1000)

function Referrals(props) {
  const [fromValue, setFromValue] = useState()
  const [toValue, setToValue] = useState()


  const from = fromValue ? +new Date(fromValue) / 1000 : undefined
  const to = toValue ? +new Date(toValue) / 1000 : NOW
  const params = { from, to, chainName: props.match?.params?.chainName || 'polygon' }

  const [referralsData, referralsLoading] = useReferralsData(params)
  const stats = useMemo(() => {
    if (!referralsData) {
      return null
    }
    const totalVolume = referralsData[referralsData.length - 1]?.volumeCumulative
    const prevTotalVolume = referralsData[referralsData.length - 2]?.volumeCumulative
    const totalVolumeDelta = totalVolume && prevTotalVolume ? totalVolume - prevTotalVolume : null

    const totalDiscountUsd = referralsData[referralsData.length - 1]?.discountUsdCumulative
    const prevTotalDiscountUsd = referralsData[referralsData.length - 2]?.discountUsdCumulative
    const totalDiscountUsdDelta = totalDiscountUsd && prevTotalDiscountUsd ? totalDiscountUsd - prevTotalDiscountUsd : null

    const totalReferrerRebateUsd = referralsData[referralsData.length - 1]?.discountUsdCumulative
    const prevTotalReferrerRebateUsd = referralsData[referralsData.length - 2]?.discountUsdCumulative
    const totalReferrerRebateUsdDelta = totalReferrerRebateUsd && prevTotalReferrerRebateUsd ? totalReferrerRebateUsd - prevTotalReferrerRebateUsd : null

    const totalReferrersCount = referralsData[referralsData.length - 1]?.referrersCountCumulative
    const prevTotalReferrersCount = referralsData[referralsData.length - 2]?.referrersCountCumulative
    const totalReferrersCountDelta = totalReferrersCount && prevTotalReferrersCount ? totalReferrersCount - prevTotalReferrersCount : null

    const totalReferralsCount = referralsData[referralsData.length - 1]?.referralsCountCumulative
    const prevTotalReferralsCount = referralsData[referralsData.length - 2]?.referralsCountCumulative
    const totalReferralsCountDelta = totalReferralsCount && prevTotalReferralsCount ? totalReferralsCount - prevTotalReferralsCount : null

    return {
      totalVolume,
      totalVolumeDelta,
      totalDiscountUsd,
      totalDiscountUsdDelta,
      totalReferrerRebateUsd,
      totalReferrerRebateUsdDelta,
      totalReferrersCount,
      totalReferrersCountDelta,
      totalReferralsCount,
      totalReferralsCountDelta
    }
  }, [referralsData])

  const [lastSubgraphBlock] = useLastSubgraphBlock()
  const [lastBlock] = useLastBlock()

  const isObsolete = lastSubgraphBlock && lastBlock && lastBlock.timestamp - lastSubgraphBlock.timestamp > 3600

  const [isExperiment, setIsExperiment] = useState(false)
  useEffect(() => {
    setIsExperiment(window.localStorage.getItem('experiment'))
  }, [setIsExperiment])


  return (
    <div className="Home">
      <h1>Analytics / Referrals</h1>
      {lastSubgraphBlock && lastBlock &&
        <p className={cx('page-description', { warning: isObsolete })} style={{ marginTop: '-1rem' }}>
          {isObsolete && "Data is obsolete. "}
          Updated {moment(lastSubgraphBlock.timestamp * 1000).fromNow()}
          &nbsp;at block <a target="_blank" rel="noreferrer" href={`https://arbiscan.io/block/${lastSubgraphBlock.number}`}>{lastSubgraphBlock.number}</a>
        </p>
      }
      <div className="chart-grid">
        <div className="chart-cell stats">
          {stats ? <>
            <div className="total-stat-label">Referral Volume</div>
            <div className="total-stat-value">
              {formatNumber(stats.totalVolume, {currency: true})}
              {stats.totalVolumeDelta &&
                <span className="total-stat-delta plus" title="Change since previous day">+{formatNumber(stats.totalVolumeDelta, {currency: true, compact: true})}</span>
              }
            </div>
          </> : <RiLoader5Fill size="3em" className="loader" />}
        </div>
        <div className="chart-cell stats">
          {stats ? <>
            <div className="total-stat-label">Traders Rebates</div>
            <div className="total-stat-value">
              {formatNumber(stats.totalDiscountUsd, {currency: true})}
              {stats.totalDiscountUsdDelta &&
                <span className="total-stat-delta plus" title="Change since previous day">+{formatNumber(stats.totalDiscountUsdDelta, {currency: true, compact: true})}</span>
              }
            </div>
          </> : <RiLoader5Fill size="3em" className="loader" />}
        </div>
        <div className="chart-cell stats">
          {stats ? <>
            <div className="total-stat-label">Affiliates Rebates</div>
            <div className="total-stat-value">
              {formatNumber(stats.totalReferrerRebateUsd, {currency: true})}
              {stats.totalReferrerRebateUsdDelta &&
                <span className="total-stat-delta plus" title="Change since previous day">+{formatNumber(stats.totalReferrerRebateUsdDelta, {currency: true, compact: true})}</span>
              }
            </div>
          </> : <RiLoader5Fill size="3em" className="loader" />}
        </div>
        <div className="chart-cell stats">
          {stats ? <>
            <div className="total-stat-label">Affiliates Registered</div>
            <div className="total-stat-value">
              {stats.totalReferrersCount}
              {stats.totalReferrersCountDelta ?
                <span className="total-stat-delta plus" title="Change since previous day">+{stats.totalReferrersCountDelta}</span> : null
              }
            </div>
          </> : <RiLoader5Fill size="3em" className="loader" />}
        </div>
        <div className="chart-cell stats">
          {stats ? <>
            <div className="total-stat-label">Referrals Registrations</div>
            <div className="total-stat-value">
              {stats.totalReferralsCount}
              {stats.totalReferralsCountDelta ?
                <span className="total-stat-delta plus" title="Change since previous day">+{stats.totalReferralsCountDelta}</span> : null
              }
            </div>
          </> : <RiLoader5Fill size="3em" className="loader" />}
        </div>
        <div className="chart-cell">
           <GenericChart
              syncId="syncMvlp"
              loading={referralsLoading}
              title="Referrals Volume"
              data={referralsData}
              yaxisDataKey="volume"
              rightYaxisDataKey="volumeCumulative"
              yaxisTickFormatter={yaxisFormatterNumber}
              tooltipFormatter={tooltipFormatterNumber}
              tooltipLabelFormatter={tooltipLabelFormatterUnits}
              items={[
                { key: 'volume', name: 'Daily', unit: '$' },
                {
                  key: 'volumeCumulative',
                  name: 'Cumulative',
                  type: 'Line',
                  yAxisId: 'right',
                  strokeWidth: 2,
                  color: COLORS[4],
                  unit: '$'
                }
              ]}
              type="Composed"
              description="Volume generated by registered referrals"
            />
        </div>
        <div className="chart-cell">
           <GenericChart
              syncId="syncMvlp"
              loading={referralsLoading}
              title="Referrals Rebates"
              data={referralsData?.map(item => ({ all: item.totalRebateUsd.toFixed(2), ...item }))}
              yaxisDataKey="totalRebateUsd"
              yaxisTickFormatter={yaxisFormatterNumber}
              tooltipFormatter={tooltipFormatterNumber}
              tooltipLabelFormatter={tooltipLabelFormatterUnits}
              items={[
                { key: 'discountUsd', name: 'Discount', unit: '$' },
                { key: 'referrerRebateUsd', name: 'Rebates', unit: '$' }
              ]}
              type="Bar"
              description="Rebates go to Affiliates, Discount go to Traders"
            />
        </div>
        <div className="chart-cell">
           <GenericChart
              syncId="syncMvlp"
              loading={referralsLoading}
              title="Registered Affiliates"
              data={referralsData}
              yaxisDataKey="referrersCount"
              rightYaxisDataKey="referrersCountCumulative"
              yaxisTickFormatter={yaxisFormatterNumber}
              tooltipFormatter={tooltipFormatterNumber}
              tooltipLabelFormatter={tooltipLabelFormatterUnits}
              items={[
                { key: 'referrersCount', type: 'Bar', name: 'Daily'},
                {
                  key: 'referrersCountCumulative',
                  strokeWidth: 2,
                  yAxisId: 'right',
                  type: 'Line',
                  name: 'Cumulative Affiliates',
                  color: COLORS[4]
                },
              ]}
              type="Composed"
            />
        </div>
        <div className="chart-cell">
           <GenericChart
              syncId="syncMvlp"
              loading={referralsLoading}
              title="Referrals Registrations"
              data={referralsData}
              yaxisDataKey="referralsCount"
              rightYaxisDataKey="referralsCountCumulative"
              yaxisTickFormatter={yaxisFormatterNumber}
              tooltipFormatter={tooltipFormatterNumber}
              tooltipLabelFormatter={tooltipLabelFormatterUnits}
              items={[
                { key: 'referralsCount', type: 'Bar', name: 'Daily'},
                {
                  key: 'referralsCountCumulative',
                  strokeWidth: 2,
                  yAxisId: 'right',
                  type: 'Line',
                  name: 'Cumulative Referrals',
                  color: COLORS[4]
                },
              ]}
              type="Composed"
              description="Traders registrations with referral code"
            />
        </div>
      </div>
    </div>
  );
}

export default Referrals;
