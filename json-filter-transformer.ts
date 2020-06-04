import { JSONFilter } from './index'
import { JSONBaseFilter } from './json-filter';

export type JSONFilterNodeTransformer = (node: JSONBaseFilter) => boolean;

export class JSONFilterTransformer {


    constructor(private transformers: Map<string, JSONFilterNodeTransformer>) {

    }

    transform(filter: JSONFilter): JSONFilter | undefined {
        let res = this.transformNode(filter);

        // pass through the result to cleanup null nodes
        res = this.cleanNode(res);

        return res;
    }

    private transformNode(node: JSONFilter): JSONFilter | any {
        if (node.Operation === 'AND' || node.Operation === 'OR') {
            node.LeftNode = this.transformNode(node.LeftNode);
            node.RightNode = this.transformNode(node.RightNode);
            return node;
        }
        else {
            return this.transformExpression(node as JSONBaseFilter);
        }
    }

    private transformExpression(expression: JSONBaseFilter): JSONFilter | undefined {
        const transformer = this.transformers.get(expression.ApiName);

        const keep = transformer ? transformer(expression) : true;
        return keep ? expression as JSONFilter : undefined;
    }

    private cleanNode(node: JSONFilter | undefined): JSONFilter | undefined {
        if (!node) {
            return undefined;
        }

        if (node.Operation === 'AND' || node.Operation === 'OR') {
            (node as any).LeftNode = this.cleanNode(node.LeftNode);
            (node as any).RightNode = this.cleanNode(node.RightNode);

            // no nodes to clean
            if (node.LeftNode && node.RightNode) {
                return node;
            }

            // if one of the nodes is null and the operation is OR we need to clean both nodes
            // because we want the result to be a stronger filter that the request
            if (!node.LeftNode) {
                return node.Operation === 'AND' ? node.RightNode : undefined;
            }
            
            if (!node.RightNode) {
                return node.Operation === 'AND' ? node.LeftNode : undefined;
            }
        }
        else {
            return node;
        }
    }
}