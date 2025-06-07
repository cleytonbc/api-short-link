import 'dotenv/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const isTelemetryEnabled = process.env.OTEL_ENABLED === 'true';

if (isTelemetryEnabled) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}

let sdk: NodeSDK | undefined;

export function startTelemetry() {
  if (!isTelemetryEnabled) {
    console.log('OpenTelemetry is disabled.');
    return;
  }

  const endpoint =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4317';

  const headers: Record<string, string> = {};
  if (process.env.OTEL_AUTH_HEADER_KEY && process.env.OTEL_AUTH_HEADER_VALUE) {
    headers[process.env.OTEL_AUTH_HEADER_KEY] =
      process.env.OTEL_AUTH_HEADER_VALUE;
  }

  sdk = new NodeSDK({
    serviceName: process.env.APP_NAME,
    traceExporter: new OTLPTraceExporter({
      url: endpoint,
      compression: CompressionAlgorithm.GZIP,
      headers,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exportIntervalMillis: 10000,
      exporter: new OTLPMetricExporter({
        url: endpoint,
        compression: CompressionAlgorithm.GZIP,
        headers,
      }),
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
      new PrismaInstrumentation({
        middleware: true,
      }),
    ],
  });

  sdk.start();
  console.log('OpenTelemetry started.');

  process.on('SIGTERM', () => {
    shutdown().catch((err) => console.error('Error on SIGTERM shutdown', err));
  });
  process.on('SIGINT', () => {
    shutdown().catch((err) => console.error('Error on SIGINT shutdown', err));
  });
}

async function shutdown() {
  if (!sdk) return;

  try {
    await sdk.shutdown();
    diag.debug('OpenTelemetry SDK terminated.');
  } catch (err) {
    diag.error('Error terminating OpenTelemetry SDK', err);
  } finally {
    process.exit(0);
  }
}

startTelemetry();
