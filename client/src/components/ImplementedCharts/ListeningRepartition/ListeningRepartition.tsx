import React, { useCallback, useMemo } from 'react';
import { api } from '../../../services/api';
import { useAPI } from '../../../services/hooks';
import Bar from '../../charts/Bar';
import { ImplementedChartProps } from '../types';
import ChartCard from '../../ChartCard';
import LoadingImplementedChart from '../LoadingImplementedChart';

interface ListeningRepartitionProps extends ImplementedChartProps {}

const formatXAxis = (value: any) => {
  return `${value}h`;
};

const formatYAxis = (value: any) => {
  return `${value}%`;
};

const formatXTooltip = (label: string) => {
  return `${label}h`;
};

export default function ListeningRepartition({ className, interval }: ListeningRepartitionProps) {
  const result = useAPI(api.timePerHourOfDay, interval.start, interval.end);

  const total = useMemo(() => result?.reduce((acc, curr) => acc + curr.count, 0) ?? 0, [result]);
  const data = useMemo(
    () =>
      Array.from(Array(24).keys()).map((i) => {
        const dataValue = result?.find((r) => r._id === i);
        if (!dataValue) {
          return {
            x: i,
            y: 0,
          };
        }
        return {
          x: i,
          y: Math.floor((dataValue.count / total) * 1000) / 10,
        };
      }),
    [result, total],
  );

  const formatYTooltip = useCallback(
    (a: any, b: any, c: any) => {
      const dataValue = result?.find((r) => r._id === c.payload.x);
      if (!dataValue) {
        return '';
      }
      return `A total of ${dataValue.count} songs, ${a}% of your daily listening`;
    },
    [result],
  );

  if (!result) {
    return <LoadingImplementedChart className={className} title="Listening repartition over day" />;
  }

  return (
    <ChartCard className={className} title="Listening repartition over day">
      <Bar
        data={data}
        xFormat={formatXAxis}
        yFormat={formatYAxis}
        tooltipLabelFormatter={formatXTooltip}
        tooltipValueFormatter={formatYTooltip}
      />
    </ChartCard>
  );
}
