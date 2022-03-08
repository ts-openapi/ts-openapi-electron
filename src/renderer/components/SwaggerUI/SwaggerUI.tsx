import { OpenAPIV3, OpenAPIV2 } from 'openapi-types';
import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function SwaggerUI(props: {
  spec: OpenAPIV3.Document | OpenAPIV2.Document;
  version: number;
}) {
  const { spec, version } = props;
  const typedSpec =
    version === 2 ? (spec as OpenAPIV2.Document) : (spec as OpenAPIV3.Document);
  return (
    <div className="SwaggerUI">
      <SwaggerUIReact spec={typedSpec} tryItOutEnabled={false} />
    </div>
  );
}

export default SwaggerUI;
