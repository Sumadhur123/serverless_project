import json
import boto3


def get_status(Order_id):
    client=boto3.resource("dynamodb")
    table=client.Table("Orders")

    id=Order_id
    response = table.get_item(
        Key={
            "OrderID":id
        }
        
        )
        
    item=response["Item"]
    RestaurantName=item["Restaurant_name"]
    items=item["Order_items"]
    Status=item["Status"]
    print(RestaurantName)
    print(items)
    print(Status)
    order =[]
    order.append(Order_id)
    order.append(RestaurantName)
    order.append(items)
    order.append(Status)
    return order




def lambda_handler(event, context):
    Order_id = event['currentIntent']['slots']['OrderId']
    id=int(Order_id)
    status = get_status(id)
    
    
    response = {
        "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "SSML",
            "content": "The status of your order id: "+str(status[0])+" ,from restaurant: " + str(status[1])+" ,with items: "+ str(status[2])+ "  is -->  "+ str(status[3])
            },
        }
    }
    #print('result = ' + str(response))
    return response